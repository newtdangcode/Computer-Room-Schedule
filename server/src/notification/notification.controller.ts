import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('api/v1/notification')
export class NotificationController {
    constructor(
        private readonly notificationService: NotificationService,
    ) {}

    @Get('get-all')
    async getAll() {
        console.log('Notification get all api...');
        return await this.notificationService.getAll();
    }

    @Patch('update/:id')
    async update(@Param('id') id: number) {
        console.log('Notification update api...');
        return await this.notificationService.update(id);
    }
}
