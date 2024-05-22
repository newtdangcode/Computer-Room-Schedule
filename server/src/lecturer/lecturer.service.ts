import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { UpdateAccountDto } from 'src/dto/account/update-account.dto';
import { CreateLecturerDto } from 'src/dto/lecturer/create-lecturer.dto';
import { UpdateLecturerDto } from 'src/dto/lecturer/update-lecturer.dto';
import { UpdateManyLecturerDto } from 'src/dto/lecturer/update-many-lecturer.dto';
import { PaginatedResource } from 'src/dto/pagination/paginated-resource.dto';
import { Account } from 'src/entities/account.entity';
import { Lecturer } from 'src/entities/lecturer.entity';
import { Filtering } from 'src/helpers/decorators/filteringParams';
import { Pagination } from 'src/helpers/decorators/paginationParams';
import { Sorting } from 'src/helpers/decorators/sortingParams';
import { getOrder, getWhere } from 'src/helpers/features';
import { In, Repository } from 'typeorm';

@Injectable()
export class LecturerService {
    constructor(
        @Inject(forwardRef(() => AuthService)) private authService: AuthService,
        @InjectRepository(Account) private accountRepository: Repository<Account>,
        @InjectRepository(Lecturer) private lecturerRepository: Repository<Lecturer>,
    ) {}

    async getAll(
        { page = 1, limit = 10, offset }: Pagination,
        sort?: Sorting,
        filter?: Filtering[],
    ): Promise<PaginatedResource<Partial<Lecturer>>> {

        const adjustedOffset = (page - 1) * limit;
    
        let where: any = getWhere(filter);
        
        where = where.reduce((prev, cur) => ({ ...prev, ...cur }), {});
    
        const order = getOrder(sort);
        const [lecturers, total] = await this.lecturerRepository.findAndCount({
            where,
            relations: { account_id: { role_id: true } },
            order,
            take: limit,
            skip: adjustedOffset,
        });
    
        const lastPage = Math.ceil(total / limit);
        const nextPage = page < lastPage ? page + 1 : null;
        const prevPage = page > 1 ? page - 1 : null;
    
        lecturers.map((lecturer) => {
            delete lecturer.account_id.password;
        });
    
        return {
            data: lecturers,
            total,
            limit,
            currentPage: page,
            nextPage,
            prevPage,
            lastPage,
        };
    }

    async getOneByCode(code: string){
        
        const lecturerAccount = await this.lecturerRepository.findOne({
            where: {
                code: code,
            },
            relations: {account_id:{role_id:true}}
        });
       
        if(lecturerAccount){
            
            delete lecturerAccount.account_id.password;
            return lecturerAccount; 
        } else {
            throw new HttpException('Lecturers is not found', HttpStatus.NOT_FOUND);
        }
    }

    async getOneByUsername(username: string){
        const account = await this.accountRepository.findOneBy({
            username: username,
        });
        if(!account){
            throw new HttpException('Lecturer is not found', HttpStatus.NOT_FOUND);
        }else {
            const lecturerAccount = await this.lecturerRepository.findOne({
                where: {
                    account_id: account,
                },
                relations: {account_id:{role_id:true}}
            });
            if(lecturerAccount){
                delete lecturerAccount.account_id.password;
                return lecturerAccount; 
            } else {
                throw new HttpException('Lecturer is not found', HttpStatus.NOT_FOUND);
            }
        }
        
    }

    async create(createLecturerDto: CreateLecturerDto) {
        return await this.authService.lecturerRegister(createLecturerDto);
    }

    async update(updateLecturerDto: UpdateLecturerDto, code:string) {
        //console.log('updateEmployeeDto', updateEmployeeDto, 'code', code);
        const employee = await this.getOneByCode(code);
        const id = employee.account_id.id;
        const {first_name, last_name, phone_number, is_active} = updateLecturerDto;
        const {username, password, email} = updateLecturerDto;
        let updateAccountDto:UpdateAccountDto;
        updateAccountDto = {username, password, email, acc_is_active: is_active};
        await this.authService.accountUpdate(updateAccountDto, id);
        await this.lecturerRepository.update(code, {first_name, last_name, phone_number, is_active});

        return await this.getOneByCode(code);
        
    }

    async updateMany(updateManyLecturerDto:UpdateManyLecturerDto[]) {
        
        if(updateManyLecturerDto.length>0){
            let updatedManyEmployees = [];
            await Promise.all(updateManyLecturerDto.map(async (item) => {
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
