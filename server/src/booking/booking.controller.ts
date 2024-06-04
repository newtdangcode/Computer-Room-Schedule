import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { BookingService } from './booking.service';
import { Pagination, PaginationParams } from 'src/helpers/decorators/paginationParams';
import { Sorting, SortingParams } from 'src/helpers/decorators/sortingParams';
import { Filtering, FilteringParams } from 'src/helpers/decorators/filteringParams';
import { PaginatedResource } from 'src/dto/pagination/paginated-resource.dto';
import { Booking } from 'src/entities/booking.entity';
import { CreateBookingtDto } from 'src/dto/booking/create-booking.dto';
import { UpdateBookingDto } from 'src/dto/booking/update-booking.dto';
import { UpdateManyBookingDto } from 'src/dto/booking/update-many-booking.dto';

@UseGuards(AuthGuard)
@Controller('api/v1/booking')
export class BookingController {
    constructor(
        private bookingService: BookingService,
    ) {}

    @Get('get-all')
    async getAll( 
        @PaginationParams() paginationParams: Pagination,
        @SortingParams(['id', 'room_code.code', 'shift_id.id', 'lecturer_code.code', 'status_id.id', 'semester_id.start_time', 'employee_code.code', 'is_active', 'created_at', 'updated_at']) sort?: Sorting,
        @FilteringParams(['id', 'room_code.code', 'shift_id.id', 'lecturer_code.code', 'status_id.id', 'semester_id.id', 'employee_code.code', 'is_active', 'created_at', 'updated_at']) filter?: Filtering[],
    ): Promise<PaginatedResource<Partial<Booking>>> {
        console.log('Booking get all api...');
        return await this.bookingService.getAll(paginationParams, sort, filter);
    }

    @Get('get-all-by-student/:code/:semester_id')
    async getAllByStudent(@Param('code') code: string, @Param('semester_id') semester_id: number) {
        console.log('Booking get all by student api...')
        return await this.bookingService.getAllByStudent(code, semester_id);
    }

    @Get('get-one/:id')
    async getOne(@Param('id') id: number) {
        console.log('Booking get one api...');
        return await this.bookingService.getOne(id);
    }
    @Get('get-many-by-room-date/:room_code/:date')
    async getManyByRoomDate(@Param('room_code') room_code: string, @Param('date') date: Date) {
        console.log('Booking get many by semester room date api...');
        return await this.bookingService.getManyByRoomDate(room_code, date);
    }
    @Post('create')
    async create(@Body() createBookingDto: CreateBookingtDto) {
        console.log('Booking create api...');
        return await this.bookingService.create(createBookingDto);
    }

    @Patch('update/:id')
    async update(@Param('id') id: number, @Body() updateBookingDto: UpdateBookingDto) {
        console.log('Booking update api...');
        return await this.bookingService.update(updateBookingDto, id);
    }

    @Patch('update-many')
    async updateMany(@Body() updateManyBookingDto: UpdateManyBookingDto[]) {
        console.log('Booking update many api ...');
        return await this.bookingService.updateMany(updateManyBookingDto);
    }
}
