import { Body, Controller, Delete, Get, Head, Param, Patch, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/entities/account.entity';
import { Repository } from 'typeorm';
import { Employee } from 'src/entities/employee.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateEmployeeDto } from 'src/auth/dto/create-employee.dto';
import { UpdateEmployeeDto } from 'src/auth/dto/update-employee.dto';
import { UpdateManyEmployeeDto } from 'src/auth/dto/update-many-employee.dto';
import { Pagination, PaginationParams } from 'src/helpers/decorators/paginationParams';
import { Sorting, SortingParams } from 'src/helpers/decorators/sortingParams';
import { Filtering, FilteringParams } from 'src/helpers/decorators/filteringParams';
import { PaginatedResource } from 'src/auth/dto/paginated-resource.dto';

@UseGuards(AuthGuard)
@Controller('api/v1/employee')
export class EmployeeController {
    constructor(
        private employeeService: EmployeeService,
    ){}
    
    @Get('get-all')
    async getAll( 
            @PaginationParams() paginationParams: Pagination,
            @SortingParams(['first_name', 'last_name', 'code', 'is_active', 'created_at', 'updated_at']) sort?: Sorting,
            @FilteringParams(['first_name', 'last_name', 'code', 'is_active', 'created_at', 'updated_at']) filter?: Filtering[]
        ): Promise<PaginatedResource<Partial<Employee>>> {
        console.log('employee get all api...');
        return await this.employeeService.getAll(paginationParams, sort, filter);
    }
    

    @Get('get-one-by-code/:code')
    async getOneBycode(@Param('code') code: string){
        return await this.employeeService.getOneByCode(code);
    }


    @Post('create')
    @UsePipes(ValidationPipe)
    async create(@Body() createEmployeeDto: CreateEmployeeDto) {
        console.log('employee create api...');
        
        return await this.employeeService.creat(createEmployeeDto);
        //return { message: 'Employee created successfully', data: createdEmployee };
    }

    @Patch('update/:code')
    @UsePipes(ValidationPipe)
    async update(@Param('code') code: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
        console.log('employee update api...');
        const updatedEmployee = await this.employeeService.update(updateEmployeeDto, code);
        return { message: 'Employee updated successfully', data: updatedEmployee };
    }
    
    @Patch('update-many')
    @UsePipes(ValidationPipe)
    async updateMany(@Body() updateManyEmployeeDto: UpdateManyEmployeeDto[]) {
        console.log('employee update many api...');
        const updatedManyEmployees = await this.employeeService.updateMany(updateManyEmployeeDto);
        return { message: 'Employee updated successfully', data: updatedManyEmployees };
    }

   
}
