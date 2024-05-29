import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PaginatedResource } from "src/dto/pagination/paginated-resource.dto";
import { RoomStatus } from "src/entities/roomStatus.entity";
import { Filtering } from "src/helpers/decorators/filteringParams";
import { Pagination } from "src/helpers/decorators/paginationParams";
import { Sorting } from "src/helpers/decorators/sortingParams";
import { getOrder, getWhere } from "src/helpers/features";
import { Repository } from "typeorm";

@Injectable()
export class RoomStatusService{
    constructor(
        @InjectRepository(RoomStatus) private roomStatusRepostiory: Repository<RoomStatus>
    ){}
    async getAll(
        { page = 1, limit = 10, offset }: Pagination,
        sort?: Sorting,
        filter?: Filtering[],
    ): Promise<PaginatedResource<Partial<RoomStatus>>> {

        const adjustedOffset = (page - 1) * limit;
    
        let where: any = getWhere(filter);
        
        where = where.reduce((prev, cur) => ({ ...prev, ...cur }), {});
    
        const order = getOrder(sort);
        const [roomStatus, total] = await this.roomStatusRepostiory.findAndCount({
            where,
            order,
            take: limit,
            skip: adjustedOffset,
        });
    
        const lastPage = Math.ceil(total / limit);
        const nextPage = page < lastPage ? page + 1 : null;
        const prevPage = page > 1 ? page - 1 : null;
    
        
    
        return {
            data: roomStatus,
            total,
            limit,
            currentPage: page,
            nextPage,
            prevPage,
            lastPage,
        };
    }
    async getOne (id:number){
        try {
            const roomFound = await this.roomStatusRepostiory.findOneBy({id });
            if(!roomFound) {
                throw new HttpException('Class is not fount', HttpStatus.NOT_FOUND);
            } else {
                return roomFound;
            }
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }
   
}