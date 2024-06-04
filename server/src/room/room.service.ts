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
import { Between, Brackets, In, Not, Or, Repository } from "typeorm";

@Injectable()
export class RoomService{
    constructor(
        @InjectRepository(Room) private roomRepository:Repository<Room>,
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
        const [rooms, total] = await this.roomRepository.findAndCount({
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
    async getScheduleInWeekByRoom(code: string, start_date: Date, end_date: Date) {
        try {
            const roomFound = await this.roomRepository.findOne({
                where: { 
                    code: code,
                    bookings: {
                        date: Between(start_date, end_date),
                        status_id: {
                            id: In([1, 2])
                        }
                    },
                    
                },
                relations:{
                    bookings: {
                        shift_id: true,
                        lecturer_code: true,
                        subject_id: {
                            students: true
                        },
                        status_id: true,
                    }
                }
            });
    
            return roomFound;
            
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }
    async getScheduleInWeekByRoomLecturer(code: string, start_date: Date, end_date: Date, lecturer_code: string) {
        try {
            const roomFound = await this.roomRepository.createQueryBuilder("room")
                .leftJoinAndSelect("room.bookings", "booking")
                .leftJoinAndSelect("booking.shift_id", "shift")
                .leftJoinAndSelect("booking.lecturer_code", "lecturer")
                .leftJoinAndSelect("booking.subject_id", "subject")
                .leftJoinAndSelect("subject.students", "student")
                .leftJoinAndSelect("booking.status_id", "status")
                .where("room.code = :code", { code })
                .andWhere("booking.date BETWEEN :start_date AND :end_date", { start_date, end_date })
                .andWhere(new Brackets(qb => {
                    qb.where("booking.lecturer_code = :lecturer_code AND booking.status_id = 2", { lecturer_code })
                      .orWhere("booking.status_id = 1");
                }))
                .getOne();
    
            return roomFound;
            
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }
    async getScheduleInWeekByRoomStudent(code: string, start_date: Date, end_date: Date, student_code: string) {
       
        try {
            let roomFound = await this.roomRepository.findOne({
                where: { 
                    code: code,
                    bookings: {
                        date: Between(start_date, end_date),
                        status_id: {
                            id: In([2])
                        }
                    },
                    
                },
                relations:{
                    bookings: {
                        shift_id: true,
                        lecturer_code: true,
                        subject_id: {
                            students: true
                        },
                        status_id: true,
                    }
                }
            });
            let filteredBookings = [];

        roomFound.bookings.forEach((booking) => {
            // Filter students by student_code
            const filteredStudents = booking.subject_id.students.filter((student) => student.code === student_code);

            // If there are filtered students, update the booking object
            if (filteredStudents.length > 0) {
                booking.subject_id.students = filteredStudents;
                filteredBookings.push(booking);
            }
        });

        // Update the room object with filtered bookings
        roomFound.bookings = filteredBookings;

        // Optional: Logging for debugging
        roomFound.bookings.forEach((booking) => {
            booking.subject_id.students.forEach((student) => {
                console.log('student.code', student.code);
            });
        });

        return roomFound;

            
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }
    
    async getOne (code:string){
        try {
            const roomFound = await this.roomRepository.findOneBy({ code });
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
            const checkExistCode = await this.roomRepository.findOneBy({ code: createRoomDto.code });
            if(checkExistCode) {
                throw new HttpException('Mã phòng đã tồn tại', HttpStatus.BAD_REQUEST);
            } else {
                const roomCreated = await this.roomRepository.save(createRoomDto);
                return roomCreated;
            }
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }
    async update(updateRoomDto: UpdateRoomDto, code: string) {
        try {
            await this.roomRepository.update(code , updateRoomDto);
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