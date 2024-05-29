import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { PaginatedResource } from "src/dto/pagination/paginated-resource.dto";
import { RoomStatus } from "src/entities/roomStatus.entity";
import { Filtering, FilteringParams } from "src/helpers/decorators/filteringParams";
import { Pagination,PaginationParams } from "src/helpers/decorators/paginationParams";
import { Sorting, SortingParams } from "src/helpers/decorators/sortingParams";
import { RoomStatusService } from "./roomStatus.service";

@UseGuards(AuthGuard)
@Controller('api/v1/roomStatus')
export class RoomStatusController{
    constructor(
        private roomStatusService:RoomStatusService,
    ){}
    @Get('get-all')
    async getAll(
        @PaginationParams() PaginationParams:Pagination,
        @SortingParams(['name','id'])sort?:Sorting,
        @FilteringParams(['name','id'])filter?:Filtering[],
    ):Promise<PaginatedResource<Partial<RoomStatus>>>{
        console.log('room-status-api...')
        return await this.roomStatusService.getAll(PaginationParams,sort,filter);
    }
    @Get('get-one/:id')
    async getOne(@Param('id')id:number){
        console.log('room status api')
        return await this.roomStatusService.getOne(id);
    }
}