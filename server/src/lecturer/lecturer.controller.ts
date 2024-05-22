import { Body, Controller, Get, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { LecturerService } from './lecturer.service';
import { Pagination, PaginationParams } from 'src/helpers/decorators/paginationParams';
import { Sorting, SortingParams } from 'src/helpers/decorators/sortingParams';
import { Filtering, FilteringParams } from 'src/helpers/decorators/filteringParams';
import { PaginatedResource } from 'src/dto/pagination/paginated-resource.dto';
import { Lecturer } from 'src/entities/lecturer.entity';
import { CreateLecturerDto } from 'src/dto/lecturer/create-lecturer.dto';
import { UpdateLecturerDto } from 'src/dto/lecturer/update-lecturer.dto';
import { UpdateManyLecturerDto } from 'src/dto/lecturer/update-many-lecturer.dto';

@UseGuards(AuthGuard)
@Controller('api/v1/lecturer')
export class LecturerController {
    constructor(
        private lecturerService: LecturerService,
    ) {}
    
    @Get('get-all')
    async getAll( 
        @PaginationParams() paginationParams: Pagination,
        @SortingParams(['first_name', 'last_name', 'code', 'is_active', 'created_at', 'updated_at']) sort?: Sorting,
        @FilteringParams(['first_name', 'last_name', 'code', 'is_active', 'created_at', 'updated_at']) filter?: Filtering[],
    ): Promise<PaginatedResource<Partial<Lecturer>>> {
        console.log('lecturer get all api...');
        return await this.lecturerService.getAll(paginationParams, sort, filter);
    }

    @Get('get-one-by-code/:code')
    async getOneBycode(@Param('code') code: string){
        return await this.lecturerService.getOneByCode(code);
    }


    @Post('create')
    @UsePipes(ValidationPipe)
    async create(@Body() createLecturerDto: CreateLecturerDto) {
        console.log('lecturer create api...');
        
        return await this.lecturerService.create(createLecturerDto);
        //return { message: 'Employee created successfully', data: createdEmployee };
    }

    @Patch('update/:code')
    @UsePipes(ValidationPipe)
    async update(@Param('code') code: string, @Body() updateLecturerDto: UpdateLecturerDto) {
        console.log('lecturer update api...');
        const updatedLecturer = await this.lecturerService.update(updateLecturerDto, code);
        return { message: 'lecturer updated successfully', data: updatedLecturer };
    }
    
    @Patch('update-many')
    @UsePipes(ValidationPipe)
    async updateMany(@Body() updateManyLecturerDto: UpdateManyLecturerDto[]) {
        console.log('lecturer update many api...');
        const updatedManyLecturers = await this.lecturerService.updateMany(updateManyLecturerDto);
        return { message: 'lecturer updated successfully', data: updatedManyLecturers };
    }

}
