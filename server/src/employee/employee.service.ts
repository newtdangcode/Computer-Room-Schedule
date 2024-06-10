import { Account } from 'src/entities/account.entity';
import { Employee } from 'src/entities/employee.entity';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import { CreateEmployeeDto } from 'src/dto/employee/create-employee.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { UpdateEmployeeDto } from 'src/dto/employee/update-employee.dto';
import { UpdateAccountDto } from 'src/dto/account/update-account.dto';
import { UpdateManyEmployeeDto } from 'src/dto/employee/update-many-employee.dto';
import { Pagination } from 'src/helpers/decorators/paginationParams';
import { Sorting } from 'src/helpers/decorators/sortingParams';
import { Filtering } from 'src/helpers/decorators/filteringParams';
import { PaginatedResource } from 'src/dto/pagination/paginated-resource.dto';
import { getOrder, getWhere } from 'src/helpers/features';
import { Not } from 'typeorm';
@Injectable()
export class EmployeeService {
    constructor(
        @Inject(forwardRef(() => AuthService)) private authService: AuthService,
        @InjectRepository(Account) private accountRepository:Repository<Account>,
        @InjectRepository(Employee) private employeeRepository:Repository<Employee>,
    ){}

    async getAll(
        { page = 1, limit = 10, offset }: Pagination,
        sort?: Sorting,
        filter?: Filtering[],
    ): Promise<PaginatedResource<Partial<Employee>>> {

        const adjustedOffset = (page - 1) * limit;
    
        let where: any = getWhere(filter);
        where = [...where, { account_id: {role_id: {id: Not(1) }}}];

        where = where.reduce((prev, cur) => ({ ...prev, ...cur }), {});
    
        const order = getOrder(sort);
        const [employees, total] = await this.employeeRepository.findAndCount({
            where,
            relations: { account_id: { role_id: true } },
            order,
            take: limit,
            skip: adjustedOffset,
        });
    
        const lastPage = Math.ceil(total / limit);
        const nextPage = page < lastPage ? page + 1 : null;
        const prevPage = page > 1 ? page - 1 : null;
    
        employees.map((employee) => {
            delete employee.account_id.password;
        });
    
        return {
            data: employees,
            total,
            limit,
            currentPage: page,
            nextPage,
            prevPage,
            lastPage,
        };
    }
    
    
    async getAllExcept(
        { page = 1, limit = 10, offset }: Pagination,
        sort?: Sorting,
        filter?: Filtering[],
        code?: string
    ): Promise<PaginatedResource<Partial<Employee>>> {
        // Adjust the offset calculation to account for 1-based page indexing
        const adjustedOffset = (page - 1) * limit;
    
        let where: any = getWhere(filter);
        
        where = [...where, { account_id: {role_id: {id: Not(1) }}}];
        
        // Combine conditions in the where array with the AND operator
        where = where.reduce((prev, cur) => ({ ...prev, ...cur }), {});
    
        const order = getOrder(sort);
        const [employees, total] = await this.employeeRepository.findAndCount({
            where,
            relations: { account_id: { role_id: true } },
            order,
            take: limit,
            skip: adjustedOffset,
        });
    
        const lastPage = Math.ceil(total / limit);
        const nextPage = page < lastPage ? page + 1 : null;
        const prevPage = page > 1 ? page - 1 : null;
    
        employees.map((employee) => {
            delete employee.account_id.password;
        });
    
        return {
            data: employees,
            total,
            limit,
            currentPage: page,
            nextPage,
            prevPage,
            lastPage,
        };
    }
    

    async getOneByCode(code: string){
        
        const employeeAccount = await this.employeeRepository.findOne({
            where: {
                code: code,
            },
            relations: {account_id:{role_id:true}}
        });
       
        if(employeeAccount){
            
            delete employeeAccount.account_id.password;
            return employeeAccount; 
        } else {
            throw new HttpException('Employees is not found', HttpStatus.NOT_FOUND);
        }
    }
    async getOneByUsername(username: string){
        const account = await this.accountRepository.findOneBy({
            username: username,
        });
        if(!account){
            throw new HttpException('Employee is not found', HttpStatus.NOT_FOUND);
        }else {
            const employeeAccount = await this.employeeRepository.findOne({
                where: {
                    account_id: account,
                },
                relations: {account_id:{role_id:true}}
            });
            if(employeeAccount){
                delete employeeAccount.account_id.password;
                return employeeAccount; 
            } else {
                throw new HttpException('Employee is not found', HttpStatus.NOT_FOUND);
            }
        }
        
    }

    async create(createEmployeeDto: CreateEmployeeDto) {
       return await this.authService.employeeRegister(createEmployeeDto);
    }

    async createMany(createEmployeeDto: CreateEmployeeDto[]) {
        try {
            // Sử dụng Promise.all để chờ đợi tất cả các promise từ Lecturer
            const results = await Promise.all(createEmployeeDto.map(async (item) => {
                return this.authService.employeeRegister(item);
            }));
            return results;
        } catch (error) {
            // Bắt lỗi nếu có bất kỳ promise nào bị từ chối
            throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }  

    async update(updateEmployeeDto: UpdateEmployeeDto, code:string) {
        //console.log('updateEmployeeDto', updateEmployeeDto, 'code', code);
        const employee = await this.getOneByCode(code);
        const id = employee.account_id.id;
        const {first_name, last_name, phone_number, is_active} = updateEmployeeDto;
        const {username, password, email} = updateEmployeeDto;
        let updateAccountDto:UpdateAccountDto;
        updateAccountDto = {username, password, email, acc_is_active: is_active};
        await this.authService.accountUpdate(updateAccountDto, id);
        await this.employeeRepository.update(code, {first_name, last_name, phone_number, is_active});

        return await this.getOneByCode(code);
        
    }

    async updateMany(updateManyEmployeeDto:UpdateManyEmployeeDto[]) {
        
        if(updateManyEmployeeDto.length>0){
            let updatedManyEmployees = [];
            await Promise.all(updateManyEmployeeDto.map(async (item) => {
                const code = item.code;
                if (code) {
                    delete item.code;
                    updatedManyEmployees.push(await this.update(item, code));
                }
            }));
            
            return updatedManyEmployees;
        }
    }
    
}
