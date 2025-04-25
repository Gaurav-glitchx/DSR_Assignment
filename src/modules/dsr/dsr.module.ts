import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DsrService } from './dsr.service';
import { DsrController } from './dsr.controller';
import { DSR } from './entities/dsr.entity';

@Module({
  imports: [SequelizeModule.forFeature([DSR])],
  controllers: [DsrController],
  providers: [DsrService],
})
export class DsrModule {} 