import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ShiftService } from './shift.service';

@UseGuards(AuthGuard)
@Controller('api/v1/shift')
export class ShiftController {
    constructor(
        private shiftService: ShiftService,
    ) {}

    @Get('get-all')
    async getAll() {
        console.log('Shift get all api...');
        return await this.shiftService.getAll();
    }
}
