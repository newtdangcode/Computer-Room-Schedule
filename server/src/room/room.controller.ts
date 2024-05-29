import { Body, Controller, Get, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { PaginatedResource } from "src/dto/pagination/paginated-resource.dto";
import { Filtering, FilteringParams } from "src/helpers/decorators/filteringParams";
import { Pagination, PaginationParams } from "src/helpers/decorators/paginationParams";
import { Sorting, SortingParams } from "src/helpers/decorators/sortingParams";
import { Room } from "src/entities/room.entity";
import { RoomService } from "./room.service";
import { CreateRoomDto } from "src/dto/room/create-room.dto";
import { UpdateRoomDto } from "src/dto/room/update-room.dto";

@UseGuards(AuthGuard)
@Controller('api/v1/room')
export class RoomController {
  constructor(
    private roomService: RoomService,
  ) {}

  @Get('get-all')
  async getAll(
    @PaginationParams() paginationParams: Pagination,
    @SortingParams(['name','code','machine_quantity','employee_code','status_id','is_active','created_at','updated_at']) sort?: Sorting,
    @FilteringParams(['name','code','machine_quantity','employee_code','status_id','is_active','created_at','updated_at']) filter?: Filtering[],
  ): Promise<PaginatedResource<Partial<Room>>> {
    console.log('room-all-api...')
    return await this.roomService.getAll(paginationParams, sort, filter);
  }

  @Get('get-one/:code')
  async getOne(@Param('code') code: string) {
    console.log('room-get-one api . . .');
    return await this.roomService.getOne(code);
  }

  @Post('create')
  @UsePipes(ValidationPipe)
  async create(@Body() createRoomDto: CreateRoomDto) {
    console.log('room create api');
    return this.roomService.create(createRoomDto);
  }

  @Patch('update/:code')
  @UsePipes(ValidationPipe)
  async update(@Param('code') code: string, @Body() updateRoomDto: UpdateRoomDto) {
    console.log('update room api');
    return await this.roomService.update(updateRoomDto, code);
  }

  @Patch('update-many')
  @UsePipes(ValidationPipe)
  async updateMany(@Body() updateManyRoomDto: UpdateRoomDto[]) {
    console.log('room update many api');
    return await this.roomService.updateMany(updateManyRoomDto);
  }
}
