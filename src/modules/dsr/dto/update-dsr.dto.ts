import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateDsrDto } from './create-dsr.dto';
import { Type } from 'class-transformer';

export class UpdateDsrDto extends PartialType(CreateDsrDto) {
  @ApiProperty({
    example: '2024-05-21',
    description: 'Date of work in YYYY-MM-DD format',
    required: false
  })
  @Type(() => Date)
  date?: Date;

  @ApiProperty({ example: 'Updated work on auth module', required: false })
  content?: string;

  @ApiProperty({ example: 6, required: false })
  hours?: number;

  @ApiProperty({ example: 'Updated Project Name', required: false })
  project?: string;
}