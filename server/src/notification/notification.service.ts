import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { promises } from 'dns';
import { Notification } from 'src/entities/notification.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Notification) private notificationRepository: Repository<Notification>,
    ) {}

    async getAll() {
        const notifications = await this.notificationRepository.find({
            order: {created_at: 'DESC'},
            relations: ['account_id', 'account_id.role_id'],
        });
        notifications.map((notification) => {
            delete notification.account_id.password;
        });
        return {data: notifications};
    }

    async getOne(id: number) {
        const notification = await this.notificationRepository.findOne({
            where: {id},
            order: {created_at: 'DESC'},
            relations: ['account_id', 'account_id.role_id'],
        });
        
        delete notification.account_id.password;

        return {data: notification};
    }
        
        

    async update(id: number)  {
       try {
        await this.notificationRepository.update(id, {unread:false});
        const notification = await this.getOne(id);
        return {data: notification};
       } catch (error) {
        throw new HttpException(error.message, error.status);
       }
    }

    async create(account_id: number, content: any) {
        try {
            const notification = await this.notificationRepository.save({
                account_id: {id: account_id},
                content,
            });
            return {data: notification};
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }
}
