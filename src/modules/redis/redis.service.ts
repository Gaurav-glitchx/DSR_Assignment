import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Redis from 'redis';
const createClient = Redis.createClient;

@Injectable()
export class RedisService implements OnModuleDestroy {
  private client: Redis.RedisClientType;

  constructor(private configService: ConfigService) {
    this.client = Redis.createClient({
      url: `redis://${this.configService.get('REDIS_HOST')}:${this.configService.get('REDIS_PORT')}`,
    });
    this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  async setOtp(email: string, otp: string): Promise<void> {
    await this.client.set(`otp:${email}`, otp, {
      EX: 300, // 5 minutes expiration
    });
  }

  async getOtp(email: string): Promise<string | null> {
    return await this.client.get(`otp:${email}`);
  }

  async deleteOtp(email: string): Promise<void> {
    await this.client.del(`otp:${email}`);
  }
} 