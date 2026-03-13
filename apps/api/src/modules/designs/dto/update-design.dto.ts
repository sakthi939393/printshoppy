import { IsString, IsOptional, IsObject } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDesignDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() canvasJson?: object;
  @ApiPropertyOptional() @IsOptional() @IsString() thumbnail?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() previewUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
}
