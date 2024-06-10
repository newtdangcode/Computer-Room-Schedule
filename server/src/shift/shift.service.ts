import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Shift } from 'src/entities/shift.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ShiftService {
    constructor(
        @InjectRepository(Shift) private shiftRepository: Repository<Shift>,
    ) {}

    async getAll() {
        return await this.shiftRepository.find();
    }
    async getOneByName(name: string) {
        return await this.shiftRepository.findOneBy({ name });
    }
}
