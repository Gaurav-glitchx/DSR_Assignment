import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { DSR } from './entities/dsr.entity';
import { CreateDsrDto } from './dto/create-dsr.dto';
import { UpdateDsrDto } from './dto/update-dsr.dto';

@Injectable()
export class DsrService {
  constructor(
    @InjectModel(DSR)
    private dsrModel: typeof DSR,
  ) {}

  async create(userId: string, createDsrDto: CreateDsrDto): Promise<DSR> {
    const selectedDate = new Date(createDsrDto.date);
    selectedDate.setHours(0, 0, 0, 0);

    const totalHours = await this.dsrModel.sum('hours', {
      where: {
        userId,
        date: selectedDate,
      },
    });

    if ((totalHours || 0) + createDsrDto.hours > 8) {
      throw new BadRequestException(
        'Total work hours for the day cannot exceed 8 hours',
      );
    }

    return this.dsrModel.create({
      ...createDsrDto,
      date: selectedDate,
      userId,
    });
  }

  async update(
    userId: string,
    dsrId: string,
    updateDsrDto: UpdateDsrDto,
  ): Promise<DSR> {
    const dsr = await this.dsrModel.findOne({
      where: { id: dsrId, userId },
    });

    if (!dsr) {
      throw new NotFoundException('DSR not found');
    }

    const selectedDate = updateDsrDto.date 
      ? new Date(updateDsrDto.date)
      : new Date(dsr.date);
    selectedDate.setHours(0, 0, 0, 0);

    const totalHours = await this.dsrModel.sum('hours', {
      where: {
        userId,
        date: selectedDate,
        id: { [Op.ne]: dsrId },
      },
    });

    const newHours = updateDsrDto.hours || dsr.hours;
    if ((totalHours || 0) + newHours > 8) {
      throw new BadRequestException(
        'Total work hours for the day cannot exceed 8 hours',
      );
    }

    await dsr.update({
      ...updateDsrDto,
      date: selectedDate,
    });
    
    return dsr.reload();
  }

  async findAll(
    userId: string,
    startDate?: Date,
    endDate?: Date,
    page = 1,
    limit = 10,
  ): Promise<{ data: DSR[]; total: number; page: number; totalPages: number }> {
    const where: any = { userId };

    if (startDate && endDate) {
      const adjustedEndDate = new Date(endDate);
      adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
      
      where.date = {
        [Op.gte]: startDate,
        [Op.lt]: adjustedEndDate,
      };
    }

    const { count, rows } = await this.dsrModel.findAndCountAll({
      where,
      limit,
      offset: (page - 1) * limit,
      order: [['date', 'DESC']],
    });

    return {
      data: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    };
  }

  async findOne(userId: string, dsrId: string): Promise<DSR> {
    const dsr = await this.dsrModel.findOne({
      where: { id: dsrId, userId },
    });

    if (!dsr) {
      throw new NotFoundException('DSR not found');
    }

    return dsr;
  }
}