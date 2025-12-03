import { IsString, IsNumber, IsEnum, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty()
  @IsString()
  marketId: string;

  @ApiProperty({ enum: ['UP', 'DOWN'] })
  @IsEnum(['UP', 'DOWN'])
  direction: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty()
  @IsNumber()
  @Min(60)
  durationSec: number;
}
