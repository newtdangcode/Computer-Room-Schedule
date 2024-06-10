import { AuthGuard } from 'src/auth/auth.guard';
import { StudentService } from './student.service';
import { Body, Controller, Delete, Get, Head, Param, Patch, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Pagination, PaginationParams } from 'src/helpers/decorators/paginationParams';
import { Sorting, SortingParams } from 'src/helpers/decorators/sortingParams';
import { Filtering, FilteringParams } from 'src/helpers/decorators/filteringParams';
import { PaginatedResource } from 'src/dto/pagination/paginated-resource.dto';
import { Student } from 'src/entities/student.entity';
import { CreateStudentDto } from 'src/dto/student/create-student.dto';
import { UpdateStudentDto } from 'src/dto/student/update-student.dto';
import { UpdateManyStudentDto } from 'src/dto/student/update-many-employee.dto';

@UseGuards(AuthGuard)
@Controller('api/v1/student')
export class StudentController {
    constructor(
        private studentService: StudentService,
    ) {}

    
    @Get('get-all')
    async getAll(
            @PaginationParams() paginationParams: Pagination,
            @SortingParams(['first_name', 'last_name', 'code', 'is_active', 'created_at', 'updated_at', 'class_code.code']) sort?: Sorting,
            @FilteringParams(['first_name', 'last_name', 'code', 'is_active', 'created_at', 'updated_at', 'class_code.code']) filter?: Filtering[],
        ): Promise<PaginatedResource<Partial<Student>>> {
        console.log('student get all api...');
        return await this.studentService.getAll(paginationParams, sort, filter);
    }

    @Get('get-one/:code')
    async getOneBycode(@Param('code') code: string){
        return await this.studentService.getOneByCode(code);
    }

    @Post('get-many')
    async getMany(@Body() codes: string[]){
        return await this.studentService.getMany(codes);
        
    }

    @Post('create')
    @UsePipes(ValidationPipe)
    async create(@Body() createStudentDto: CreateStudentDto) {
        console.log('student create api...');
        
        return await this.studentService.creat(createStudentDto);
    }

    @Post('create-many')
    @UsePipes(ValidationPipe)
    async createMany(@Body() createStudentDto: CreateStudentDto[]) {
        console.log('student createMany api...');
        
        return await this.studentService.createMany(createStudentDto);
    }

    @Patch('update/:code')
    @UsePipes(ValidationPipe)
    async update(@Param('code') code: string, @Body() updateStudentDto: UpdateStudentDto) {
        console.log('student update api...');
        const updatedStudent = await this.studentService.update(updateStudentDto, code);
        return { message: 'Student updated successfully', data: updatedStudent };
    }

    @Patch('update-many')
    @UsePipes(ValidationPipe)
    async updateMany(@Body() updateManyStudentDto: UpdateManyStudentDto[]) {
        console.log('student update many api...');
        const updatedManyStudent = await this.studentService.updateMany(updateManyStudentDto);
        return { message: 'Student updated successfully', data: updatedManyStudent };
    }
}
