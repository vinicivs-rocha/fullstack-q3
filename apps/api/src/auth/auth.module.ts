import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveyorModel } from '../surveyor/abstractions/models/surveyor.model';
import { AuthGatewayImplementation } from './data/gateways/auth.gateway';
import { SurveyorLocalStrategy } from './api/strategies/surveyor.local.strategy';
import { AuthController } from './api/controllers/auth.controller';
import Redis from 'ioredis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SurveyorJwtStrategy } from './api/strategies/surveyor.jwt.strategy';
import { SurveyorRefreshJwtStrategy } from './api/strategies/surveyor-refresh.jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([SurveyorModel]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],
  providers: [
    AuthGatewayImplementation,
    SurveyorLocalStrategy,
    {
      provide: Redis,
      useFactory: (configService: ConfigService) => {
        return new Redis({
          host: configService.get<string>('REDIS_HOST'),
          port: Number(configService.get<string>('REDIS_PORT')),
          maxRetriesPerRequest: 3,
          enableReadyCheck: true,
          retryStrategy: (times) => {
            return Math.min(times * 50, 1000);
          },
        });
      },
      inject: [ConfigService],
    },
    SurveyorJwtStrategy,
    SurveyorRefreshJwtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
