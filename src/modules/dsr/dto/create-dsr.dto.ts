import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateDsrDto {
  @ApiProperty({
    example: '2024-05-20',
    description: 'Date of work in YYYY-MM-DD format'
  })
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  date: Date;

  @ApiProperty({ example: 'Worked on user authentication module' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: 8, description: 'Number of hours worked (max 8)' })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(8)
  hours: number;

  @ApiProperty({ example: 'DSR Management System' })
  @IsString()
  @IsNotEmpty()
  project: string;
}