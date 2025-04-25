import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from './modules/user/user.module';
import { DsrModule } from './modules/dsr/dsr.module';
import { AuthModule } from './modules/auth/auth.module';
import { RedisModule } from './modules/redis/redis.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { EmailModule } from './modules/email/email.module';
import { WinstonLoggerService } from './modules/logger/winston.logger';
import {LoggingMiddleware} from './modules/logger/logging.middleware'
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        autoLoadModels: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    DsrModule,
    AuthModule,
    RedisModule,
    CloudinaryModule,
    EmailModule,
  ],
  providers:[WinstonLoggerService],
})
export class AppModule {
  configure(consumer:MiddlewareConsumer){
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
