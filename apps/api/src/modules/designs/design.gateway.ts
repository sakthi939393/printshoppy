import {
  WebSocketGateway, WebSocketServer, SubscribeMessage,
  OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect,
  MessageBody, ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/design',
})
export class DesignGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(DesignGateway.name);
  private designSessions = new Map<string, Set<string>>();

  constructor(private jwtService: JwtService) {}

  afterInit() {
    this.logger.log('Design WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.designSessions.forEach((clients, designId) => {
      clients.delete(client.id);
      if (clients.size === 0) this.designSessions.delete(designId);
    });
  }

  @SubscribeMessage('join-design')
  handleJoinDesign(
    @MessageBody() data: { designId: string; token: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      this.jwtService.verify(data.token);
      client.join(`design:${data.designId}`);

      if (!this.designSessions.has(data.designId)) {
        this.designSessions.set(data.designId, new Set());
      }
      this.designSessions.get(data.designId)!.add(client.id);

      const collaborators = this.designSessions.get(data.designId)!.size;
      this.server.to(`design:${data.designId}`).emit('collaborator-count', { count: collaborators });
    } catch {
      client.emit('error', { message: 'Unauthorized' });
    }
  }

  @SubscribeMessage('canvas-update')
  handleCanvasUpdate(
    @MessageBody() data: { designId: string; canvasJson: object; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    // Broadcast to all other clients in the room
    client.to(`design:${data.designId}`).emit('canvas-updated', {
      canvasJson: data.canvasJson,
      updatedBy: data.userId,
    });
  }

  @SubscribeMessage('cursor-move')
  handleCursorMove(
    @MessageBody() data: { designId: string; x: number; y: number; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.to(`design:${data.designId}`).emit('cursor-moved', data);
  }
}
