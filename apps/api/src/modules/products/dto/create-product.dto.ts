import {
  IsString, IsNumber, IsOptional, IsBoolean, IsArray,
  IsEnum, Min, ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class CreateVariantDto {
  @IsString() name: string;
  @IsString() sku: string;
  @IsNumber() price: number;
  @IsOptional() @IsString() size?: string;
  @IsOptional() @IsString() color?: string;
  @IsOptional() @IsString() colorHex?: string;
  @IsOptional() @IsString() material?: string;
  @IsOptional() @IsNumber() stock?: number;
}

class CreatePrintAreaDto {
  @IsString() name: string;
  @IsNumber() x: number;
  @IsNumber() y: number;
  @IsNumber() width: number;
  @IsNumber() height: number;
  @IsOptional() @IsString() maskUrl?: string;
  @IsOptional() @IsNumber() allowedDpi?: number;
}

class CreateProductImageDto {
  @IsString() url: string;
  @IsOptional() @IsString() altText?: string;
  @IsOptional() @IsBoolean() isPrimary?: boolean;
}

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  categoryId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  basePrice: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(['ACTIVE', 'INACTIVE', 'DRAFT'])
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isCustomizable?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  minQuantity?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  productionDays?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  variants?: CreateVariantDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductImageDto)
  images?: CreateProductImageDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePrintAreaDto)
  printAreas?: CreatePrintAreaDto[];
}
