import { Account } from 'src/entities/account.entity';
import { Employee } from 'src/entities/employee.entity';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import { CreateEmployeeDto } from 'src/dto/create-employee.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { UpdateEmployeeDto } from 'src/dto/update-employee.dto';
import { UpdateAccountDto } from 'src/dto/update-account.dto';
import { UpdateManyEmployeeDto } from 'src/dto/update-many-employee.dto';
import { Pagination } from 'src/helpers/decorators/paginationParams';
import { Sorting } from 'src/helpers/decorators/sortingParams';
import { Filtering } from 'src/helpers/decorators/filteringParams';
import { PaginatedResource } from 'src/dto/paginated-resource.dto';
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
        { page=0, limit=10, offset }: Pagination,
        sort?: Sorting,
        filter?: Filtering[],
        code?: string
    ): Promise<PaginatedResource<Partial<Employee>>> {
        let where: any = getWhere(filter);
        if(code){
            where = [...where, {code: Not(code)}];
        }
        // Gộp các điều kiện trong mảng where bằng toán tử AND
        where = where.reduce((prev, cur) => ({ ...prev, ...cur }), {});
        const order = getOrder(sort);
        const [employees, total] = await this.employeeRepository.findAndCount({
            where,
            relations: {account_id:{role_id:true}},
            order,
            take: limit,
            skip: offset,
        });
        const lastPage = Math.ceil(total / limit);
        const nextPage = page < lastPage ? page + 1 : null;
        const prevPage = page > 0 ? page - 1 : null;
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
