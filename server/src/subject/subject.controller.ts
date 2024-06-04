import { Body, Controller, Get, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { SubjectService } from './subject.service';
import { Pagination, PaginationParams } from 'src/helpers/decorators/paginationParams';
import { Sorting, SortingParams } from 'src/helpers/decorators/sortingParams';
import { Filtering, FilteringParams } from 'src/helpers/decorators/filteringParams';
import { Subject } from 'src/entities/subject.entity';
import { PaginatedResource } from 'src/dto/pagination/paginated-resource.dto';
import { CreateSubjectDto } from 'src/dto/subject/create-subject.dto';
import { UpdateSubjectDto } from 'src/dto/subject/update-subject.dto';
import { UpdateManySubjectDto } from 'src/dto/subject/update-many-subject.dto';

@UseGuards(AuthGuard)
@Controller('api/v1/subject')
export class SubjectController {
    constructor(
        private subjectService: SubjectService,
    ) {}

    @Get('get-all')
    async getAll( 
            @PaginationParams() paginationParams: Pagination,
            @SortingParams(['name', 'code', 'is_active', 'created_at', 'updated_at']) sort?: Sorting,
            @FilteringParams(['name', 'code', 'is_active', 'lecturer_code.code', 'semester_id.id', 'created_at', 'updated_at']) filter?: Filtering[],
        ): Promise<PaginatedResource<Partial<Subject>>> {
        console.log('Subject get all api...');
        return await this.subjectService.getAll(paginationParams, sort, filter);
    }

    @Get('get-one/:id')
    async getOne(@Param('id') id: number){
        return await this.subjectService.getOneById(id);
    }

    @Post('create')
    @UsePipes(ValidationPipe)
    async create(@Body() createSubjectDto: CreateSubjectDto) {
        console.log('Subject create api...');
        return await this.subjectService.create(createSubjectDto);
    }

    @Patch('add-students-to-subject/:id')
    async addStudentsToSubject(@Param('id') id: number, @Body() student_codes: string[]) {
       
        console.log('Subject add students to subject api...');
        return await this.subjectService.addStudentsToSubject(id, student_codes);
    }

    @Patch('update/:id')
    @UsePipes(ValidationPipe)
    async update(@Param('id') id: number, @Body() updateSubjectDto: UpdateSubjectDto) {
        console.log('Subject update api...');
        return await this.subjectService.update(updateSubjectDto, id);
    }

    @Patch('update-many')
    @UsePipes(ValidationPipe)
    async updateMany(@Body() updateManySubjectDto: UpdateManySubjectDto[]) {
        console.log('Subject update many api ...');
        return await this.subjectService.updateMany(updateManySubjectDto);
    }
}
