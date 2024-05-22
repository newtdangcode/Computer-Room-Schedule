import { Injectable, Inject, forwardRef, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from 'src/entities/account.entity';
import { Student } from 'src/entities/student.entity';
import { AuthService } from 'src/auth/auth.service';
import { Pagination } from 'src/helpers/decorators/paginationParams';
import { Sorting } from 'src/helpers/decorators/sortingParams';
import { Filtering } from 'src/helpers/decorators/filteringParams';
import { PaginatedResource } from 'src/dto/pagination/paginated-resource.dto';
import { getOrder, getWhere } from 'src/helpers/features';
import { Not } from 'typeorm';
import { CreateStudentDto } from 'src/dto/student/create-student.dto';
import { UpdateStudentDto } from 'src/dto/student/update-student.dto';
import { UpdateAccountDto } from 'src/dto/account/update-account.dto';
import { UpdateManyStudentDto } from 'src/dto/student/update-many-employee.dto';

@Injectable()
export class StudentService {
    constructor(
        @Inject(forwardRef(() => AuthService)) private authService: AuthService,
        @InjectRepository(Account) private accountRepository:Repository<Account>,
        @InjectRepository(Student) private studentRepository:Repository<Student>,
    ) {}

    async getAll(
        { page = 1, limit = 10, offset }: Pagination,
        sort?: Sorting,
        filter?: Filtering[],
    ): Promise<PaginatedResource<Partial<Student>>> {

        const adjustedOffset = (page - 1) * limit;
    
        let where: any = getWhere(filter);
        
        where = where.reduce((prev, cur) => ({ ...prev, ...cur }), {});
    
        const order = getOrder(sort);
        const [students, total] = await this.studentRepository.findAndCount({
            where,
            relations: { account_id: { role_id: true }, class_code: true},
            order,
            take: limit,
            skip: adjustedOffset,
        });
    
        const lastPage = Math.ceil(total / limit);
        const nextPage = page < lastPage ? page + 1 : null;
        const prevPage = page > 1 ? page - 1 : null;
    
        students.map((student) => {
            delete student.account_id.password;
        });
    
        return {
            data: students,
            total,
            limit,
            currentPage: page,
            nextPage,
            prevPage,
            lastPage,
        };
    }

    async getOneByCode(code: string){
        
        const studentAccount = await this.studentRepository.findOne({
            where: {
                code: code,
            },
            relations: {account_id:{role_id:true}, class_code:true}
        });
       
        if(studentAccount){
            
            delete studentAccount.account_id.password;
            return studentAccount; 
        } else {
            throw new HttpException('Student is not found', HttpStatus.NOT_FOUND);
        }
    }
    async getOneByUsername(username: string){
        const account = await this.accountRepository.findOneBy({
            username: username,
        });
        if(!account){
            throw new HttpException('Student is not found', HttpStatus.NOT_FOUND);
        }else {
            const studentAccount = await this.studentRepository.findOne({
                where: {
                    account_id: account,
                },
                relations: {account_id:{role_id:true}, class_code:true}
            });
            if(studentAccount){
                delete studentAccount.account_id.password;
                return studentAccount; 
            } else {
                throw new HttpException('Student is not found', HttpStatus.NOT_FOUND);
            }
        }
        
    }

    async creat(createStudentDto: CreateStudentDto) {
        return await this.authService.studentRegister(createStudentDto);
    }

    async update(updateStudentDto: UpdateStudentDto, code:string) {
        //console.log('updateEmployeeDto', updateEmployeeDto, 'code', code);
        const student = await this.getOneByCode(code);
        const id = student.account_id.id;
        const {first_name, last_name, phone_number, is_active, class_code} = updateStudentDto;
        const {username, password, email} = updateStudentDto;
        let updateAccountDto:UpdateAccountDto;
        updateAccountDto = {username, password, email, acc_is_active: is_active};
        await this.authService.accountUpdate(updateAccountDto, id);
        console.log(student.class_code.code);
     
        await this.studentRepository.update(code, {first_name, last_name, phone_number, is_active, class_code:{code:class_code||student.class_code.code}});

        return await this.getOneByCode(code);
        
    }

    async updateMany(updateManyStudentDto:UpdateManyStudentDto[]) {
        
        if(updateManyStudentDto.length>0){
            let updatedManyEmployees = [];
            await Promise.all(updateManyStudentDto.map(async (item) => {
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
