import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginatedResource } from 'src/dto/pagination/paginated-resource.dto';
import { CreateSemesterDto } from 'src/dto/semester/create-semester.dto';
import { UpdateManySemesterDto } from 'src/dto/semester/update-many-semester.dto';
import { UpdateSemesterDto } from 'src/dto/semester/update-semester.dto';
import { Semester } from 'src/entities/semester.entity';
import { Filtering } from 'src/helpers/decorators/filteringParams';
import { Pagination } from 'src/helpers/decorators/paginationParams';
import { Sorting } from 'src/helpers/decorators/sortingParams';
import { getOrder, getWhere } from 'src/helpers/features';
import { Repository } from 'typeorm';

@Injectable()
export class SemesterService {
    constructor(
        @InjectRepository(Semester) private semesterRepository: Repository<Semester>,
    ) {}

    async getAll(
        { page = 1, limit = 10, offset }: Pagination,
        sort?: Sorting,
        filter?: Filtering[],
    ): Promise<PaginatedResource<Partial<Semester>>> {

        const adjustedOffset = (page - 1) * limit;
    
        let where: any = getWhere(filter);
        
        where = where.reduce((prev, cur) => ({ ...prev, ...cur }), {});
    
        const order = getOrder(sort);
        const [semesters, total] = await this.semesterRepository.findAndCount({
            where,
            order,
            take: limit,
            skip: adjustedOffset,
        });
    
        const lastPage = Math.ceil(total / limit);
        const nextPage = page < lastPage ? page + 1 : null;
        const prevPage = page > 1 ? page - 1 : null;

        return {
            data: semesters,
            total,
            limit,
            currentPage: page,
            nextPage,
            prevPage,
            lastPage,
        };
    }

    async getOne(id: number) {
        try {
            const semesterFound = await this.semesterRepository.findOneBy({ id });
            if(!semesterFound) {
                throw new HttpException('Semester is not fount', HttpStatus.NOT_FOUND);
            } else {
                return semesterFound;
            }
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    async create(createSemesterDto: CreateSemesterDto) {
        try {
            const semesterCreated = await this.semesterRepository.save(createSemesterDto);
            return semesterCreated;
           
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    async update(updateSemesterDto: UpdateSemesterDto, id: number) {
        try {
            await this.semesterRepository.update(id , updateSemesterDto);
            return this.getOne(id);
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    async updateMany(updateManySemesterDto: UpdateManySemesterDto[]) {
        try {
            
            if(updateManySemesterDto.length > 0) {
                let updatedManyClasses = [];
                await Promise.all(updateManySemesterDto.map(async (item) => {
                    const id = item.id;
                    if(id) {
                        delete item.id;
                        updatedManyClasses.push(await this.update(item, id));
                    }
                }));
                return updatedManyClasses;
            }

        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

}
