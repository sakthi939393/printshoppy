import { Module } from '@nestjs/common';
import { DesignsController } from './designs.controller';
import { DesignsService } from './designs.service';
import { DesignGateway } from './design.gateway';
import { UploadsModule } from '../uploads/uploads.module';

@Module({
  imports: [UploadsModule],
  controllers: [DesignsController],
  providers: [DesignsService, DesignGateway],
  exports: [DesignsService],
})
export class DesignsModule {}
