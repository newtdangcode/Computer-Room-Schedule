import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Account } from 'src/entities/account.entity';
import { Notification } from 'src/entities/notification.entity';
import { NotificationGateway } from './notification.gatewage';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, Account]),
    ConfigModule,

  ],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationGateway]
})
export class NotificationModule {}
