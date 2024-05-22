import { Module } from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from 'src/entities/class.entity';
import { config } from 'process';
import { ConfigModule } from '@nestjs/config';
import { CreateClassDto } from 'src/dto/create-class.dto';
import { UpdateClassDto } from 'src/dto/update-class.dto';

@Module({
  imports: [
    TypeOrmModule.forFeature([Class]),
    ConfigModule,
    CreateClassDto,
    UpdateClassDto,
    

  ],
  providers: [ClassService],
  controllers: [ClassController],
  exports: [ClassService],
})
export class ClassModule {}
