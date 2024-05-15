import { Account } from 'src/entities/account.entity';
import { Employee } from 'src/entities/employee.entity';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import { CreateEmployeeDto } from 'src/auth/dto/create-employee.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { UpdateEmployeeDto } from 'src/auth/dto/update-employee.dto';
import { UpdateAccountDto } from 'src/auth/dto/update-account.dto';
import { UpdateManyEmployeeDto } from 'src/auth/dto/update-many-employee.dto';
import { Pagination } from 'src/helpers/decorators/paginationParams';
import { Sorting } from 'src/helpers/decorators/sortingParams';
import { Filtering } from 'src/helpers/decorators/filteringParams';
import { PaginatedResource } from 'src/auth/dto/paginated-resource.dto';
import { getOrder, getWhere } from 'src/helpers/typeOrmHelpers';
@Injectable()
export class EmployeeService {
    constructor(
        @Inject(forwardRef(() => AuthService)) private authService: AuthService,
        @InjectRepository(Account) private accountRepository:Repository<Account>,
        @InjectRepository(Employee) private employeeRepository:Repository<Employee>,
    ){}

    
    async getAll( 
        { page, limit, offset }: Pagination,
        sort?: Sorting,
        filter?: Filtering,
    ): Promise<PaginatedResource<Partial<Employee>>> {
        const where = getWhere(filter);
        const order = getOrder(sort);
        const [employees, total] = await this.employeeRepository.findAndCount({
            where,
            order,
            take: limit,
            skip: offset,
        });
        const lastPage = Math.ceil(total / limit);
        const nextPage = page < lastPage ? page + 1 : null;
        const prevPage = page > 0 ? page - 1 : null;

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
            relations: ['account_id']
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
            throw new HttpException('Employees is not found', HttpStatus.NOT_FOUND);
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
                throw new HttpException('Employees is not found', HttpStatus.NOT_FOUND);
            }
        }
        
    }

    async creat(createEmployeeDto: CreateEmployeeDto) {
       return await this.authService.employeeRegister(createEmployeeDto);
    }

    async update(updateEmployeeDto: UpdateEmployeeDto, code:string) {
        
        const employee = await this.getOneByCode(code);
        const id = employee.account_id.id;
        const {username, password, email} = updateEmployeeDto;
        let updateAccountDto:UpdateAccountDto;
        updateAccountDto = {username, password, email};
        await this.authService.accountUpdate(updateAccountDto, id);

        // delete updateEmployeeDto.username;
        // delete updateEmployeeDto.password;
        // delete updateAccountDto.email;
        const {first_name, last_name, phone_number} = updateEmployeeDto;


        await this.employeeRepository.update(code, {first_name, last_name, phone_number});

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
