import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PaginatedResource } from "src/dto/pagination/paginated-resource.dto";
import { CreateRoomDto } from "src/dto/room/create-room.dto";
import { UpdateManyRoomDto } from "src/dto/room/update-many-room.dto";
import { UpdateRoomDto } from "src/dto/room/update-room.dto";
import { Room } from "src/entities/room.entity";
import { Filtering } from "src/helpers/decorators/filteringParams";
import { Pagination } from "src/helpers/decorators/paginationParams";
import { Sorting } from "src/helpers/decorators/sortingParams";
import { getOrder, getWhere } from "src/helpers/features";
import { Repository } from "typeorm";

@Injectable()
export class RoomService{
    constructor(
        @InjectRepository(Room) private roomRepostiory:Repository<Room>,
    ){}
    async getAll(
        { page = 1, limit = 10, offset }: Pagination,
        sort?: Sorting,
        filter?: Filtering[],
    ): Promise<PaginatedResource<Partial<Room>>> {

        const adjustedOffset = (page - 1) * limit;
    
        let where: any = getWhere(filter);
        
        where = where.reduce((prev, cur) => ({ ...prev, ...cur }), {});
    
        const order = getOrder(sort);
        const [rooms, total] = await this.roomRepostiory.findAndCount({
            where,
            relations: {status_id:true},
            order,
            take: limit,
            skip: adjustedOffset,
        });
    
        const lastPage = Math.ceil(total / limit);
        const nextPage = page < lastPage ? page + 1 : null;
        const prevPage = page > 1 ? page - 1 : null;
    
        
    
        return {
            data: rooms,
            total,
            limit,
            currentPage: page,
            nextPage,
            prevPage,
            lastPage,
        };
    }
    async getOne (code:string){
        try {
            const roomFound = await this.roomRepostiory.findOneBy({ code });
            if(!roomFound) {
                throw new HttpException('Class is not fount', HttpStatus.NOT_FOUND);
            } else {
                return roomFound;
            }
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }
    async create(createRoomDto:CreateRoomDto) {
        try {
            const checkExistCode = await this.roomRepostiory.findOneBy({ code: createRoomDto.code });
            if(checkExistCode) {
                throw new HttpException('Mã phòng đã tồn tại', HttpStatus.BAD_REQUEST);
            } else {
                const roomCreated = await this.roomRepostiory.save(createRoomDto);
                return roomCreated;
            }
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }
    async update(updateRoomDto: UpdateRoomDto, code: string) {
        try {
            await this.roomRepostiory.update(code , updateRoomDto);
            return this.getOne(code);
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }
    async updateMany(updateManyRoomDto:UpdateManyRoomDto[]){
        try {
            
            if(updateManyRoomDto.length > 0) {
                let updateManyRoom = [];
                await Promise.all(updateManyRoomDto.map(async (item) => {
                    const code = item.code;
                    if(code) {
                        delete item.code;
                        updateManyRoom.push(await this.update(item, code));
                    }
                }));
                return updateManyRoom;
            }

        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }
    

}