import { Body, Controller, Get, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { SemesterService } from './semester.service';
import { Pagination, PaginationParams } from 'src/helpers/decorators/paginationParams';
import { Sorting, SortingParams } from 'src/helpers/decorators/sortingParams';
import { Filtering, FilteringParams } from 'src/helpers/decorators/filteringParams';
import { Semester } from 'src/entities/semester.entity';
import { PaginatedResource } from 'src/dto/pagination/paginated-resource.dto';
import { CreateSemesterDto } from 'src/dto/semester/create-semester.dto';
import { UpdateSemesterDto } from 'src/dto/semester/update-semester.dto';
import { UpdateManySemesterDto } from 'src/dto/semester/update-many-semester.dto';

@UseGuards(AuthGuard)
@Controller('api/v1/semester')
export class SemesterController {
    constructor(
        private semesterService: SemesterService,
    ){}

    @Get('get-all')
    async getAll( 
            @PaginationParams() paginationParams: Pagination,
            @SortingParams(['name', 'start_time', 'end_time', 'is_active', 'created_at', 'updated_at']) sort?: Sorting,
            @FilteringParams(['name', 'start_time', 'end_time', 'is_active', 'created_at', 'updated_at']) filter?: Filtering[],
        ): Promise<PaginatedResource<Partial<Semester>>> {
        console.log('semester get all api...');
        return await this.semesterService.getAll(paginationParams, sort, filter);
    }

    @Get('get-one/:id')
    async getOne(@Param('id') id: number){
        return await this.semesterService.getOne(id);
    }

    @Post('create')
    @UsePipes(ValidationPipe)
    async create(@Body() createSemesterDto: CreateSemesterDto) {
        console.log('semester create api...');
       
        return await this.semesterService.create(createSemesterDto);
    }

    @Patch('update/:id')
    @UsePipes(ValidationPipe)
    async update(@Param('id') id: number, @Body() updateSemesterDto: UpdateSemesterDto) {
        console.log('semester update api...');
        return await this.semesterService.update(updateSemesterDto, id);
    }

    @Patch('update-many')
    @UsePipes(ValidationPipe)
    async updateMany(@Body() updateManySemesterDto: UpdateManySemesterDto[]) {
        console.log('semester update many api ...');
        return await this.semesterService.updateMany(updateManySemesterDto);
    }
}
