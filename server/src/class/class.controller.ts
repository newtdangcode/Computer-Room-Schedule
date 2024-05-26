import { Body, Controller, Get, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ClassService } from './class.service';
import { Class } from 'src/entities/class.entity';
import { Pagination, PaginationParams } from 'src/helpers/decorators/paginationParams';
import { Sorting, SortingParams } from 'src/helpers/decorators/sortingParams';
import { Filtering, FilteringParams } from 'src/helpers/decorators/filteringParams';
import { PaginatedResource } from 'src/dto/pagination/paginated-resource.dto';
import { UpdateClassDto } from 'src/dto/class/update-class.dto';
import { CreateClassDto } from 'src/dto/class/create-class.dto';
import { UpdateManyClassDto } from 'src/dto/class/update-many-class.dto';
@UseGuards(AuthGuard)
@Controller('api/v1/class')
export class ClassController {
    constructor(
        private classService: ClassService,
    ){}

    @Get('get-all')
    async getAll( 
            @PaginationParams() paginationParams: Pagination,
            @SortingParams(['name', 'code', 'is_active', 'created_at', 'updated_at']) sort?: Sorting,
            @FilteringParams(['name', 'code', 'is_active', 'created_at', 'updated_at']) filter?: Filtering[],
        ): Promise<PaginatedResource<Partial<Class>>> {
        console.log('class get all api...');
        return await this.classService.getAll(paginationParams, sort, filter);
    }

    @Get('get-one/:code')
    async getOne(@Param('code') code: string){
        return await this.classService.getOne(code);
    }
    @Get(('get-student-list/:code'))
    async getStudentList(@Param('code') code: string) {
        return await this.classService.getStudentList(code);
    }

    @Post('create')
    @UsePipes(ValidationPipe)
    async create(@Body() createClassDto: CreateClassDto) {
        console.log('class create api...');
        return await this.classService.create(createClassDto);
    }

    @Patch('update/:code')
    @UsePipes(ValidationPipe)
    async update(@Param('code') code: string, @Body() updateClassDto: UpdateClassDto) {
        console.log('class update api...');
        return await this.classService.update(updateClassDto, code);
    }

    @Patch('update-many')
    @UsePipes(ValidationPipe)
    async updateMany(@Body() updateManyClassDto: UpdateManyClassDto[]) {
        console.log('class update many api ...');
        return await this.classService.updateMany(updateManyClassDto);
    }
}
