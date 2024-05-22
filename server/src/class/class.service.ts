import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { privateDecrypt } from 'crypto';
import { Repository } from 'typeorm';
import { Class } from 'src/entities/class.entity';
import { Filtering } from 'src/helpers/decorators/filteringParams';
import { Sorting } from 'src/helpers/decorators/sortingParams';
import { PaginatedResource } from 'src/dto/pagination/paginated-resource.dto';
import { Pagination } from 'src/helpers/decorators/paginationParams';
import { getWhere, getOrder } from 'src/helpers/features';
import { CreateClassDto } from 'src/dto/class/create-class.dto';
import { UpdateAccountDto } from 'src/dto/account/update-account.dto';
import { UpdateClassDto } from 'src/dto/class/update-class.dto';
import { UpdateManyClassDto } from 'src/dto/class/update-many-class.dto';

@Injectable()
export class ClassService {
    constructor(
        @InjectRepository(Class) private classRepostiory: Repository<Class>,
    ) {}

    async getAll(
        { page = 1, limit = 10, offset }: Pagination,
        sort?: Sorting,
        filter?: Filtering[],
    ): Promise<PaginatedResource<Partial<Class>>> {

        const adjustedOffset = (page - 1) * limit;
    
        let where: any = getWhere(filter);
        
        where = where.reduce((prev, cur) => ({ ...prev, ...cur }), {});
    
        const order = getOrder(sort);
        const [classs, total] = await this.classRepostiory.findAndCount({
            where,
            order,
            take: limit,
            skip: adjustedOffset,
        });
    
        const lastPage = Math.ceil(total / limit);
        const nextPage = page < lastPage ? page + 1 : null;
        const prevPage = page > 1 ? page - 1 : null;
    
        
    
        return {
            data: classs,
            total,
            limit,
            currentPage: page,
            nextPage,
            prevPage,
            lastPage,
        };
    }

    async getOne(code: string) {
        try {
            const classFound = await this.classRepostiory.findOneBy({ code });
            if(!classFound) {
                throw new HttpException('Class is not fount', HttpStatus.NOT_FOUND);
            } else {
                return classFound;
            }
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    async create(createClassDto: CreateClassDto) {
        try {
            const checkExistCode = await this.classRepostiory.findOneBy({ code: createClassDto.code });
            if(checkExistCode) {
                throw new HttpException('Mã lớp đã tồn tại', HttpStatus.BAD_REQUEST);
            } else {
                const classCreated = await this.classRepostiory.save(createClassDto);
                return classCreated;
            }
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    async update(updateClassDto: UpdateClassDto, code: string) {
        try {
            await this.classRepostiory.update(code , updateClassDto);
            return this.getOne(code);
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    async updateMany(updateManyClassDto: UpdateManyClassDto[]) {
        try {
            
            if(updateManyClassDto.length > 0) {
                let updatedManyClasses = [];
                await Promise.all(updateManyClassDto.map(async (item) => {
                    const code = item.code;
                    if(code) {
                        delete item.code;
                        updatedManyClasses.push(await this.update(item, code));
                    }
                }));
                return updatedManyClasses;
            }

        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }
}
