import { Column, Model, Table, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../../user/entities/user.entity';

@Table({
  tableName: 'dsrs',
  timestamps: true,
})
export class DSR extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare userId: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare date: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare content: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
      max: 8,
    },
  })
  declare hours: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare project: string;

  @BelongsTo(() => User)
  declare user: User;
}