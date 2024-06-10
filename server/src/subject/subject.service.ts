import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginatedResource } from 'src/dto/pagination/paginated-resource.dto';
import { CreateSubjectDto } from 'src/dto/subject/create-subject.dto';
import { UpdateManySubjectDto } from 'src/dto/subject/update-many-subject.dto';
import { UpdateSubjectDto } from 'src/dto/subject/update-subject.dto';
import { Lecturer } from 'src/entities/lecturer.entity';
import { Semester } from 'src/entities/semester.entity';
import { Subject } from 'src/entities/subject.entity';
import { Filtering } from 'src/helpers/decorators/filteringParams';
import { Pagination } from 'src/helpers/decorators/paginationParams';
import { Sorting } from 'src/helpers/decorators/sortingParams';
import { getOrder, getWhere } from 'src/helpers/features';
import { StudentService } from 'src/student/student.service';
import { Repository } from 'typeorm';
@Injectable()
export class SubjectService {
    constructor(
        @Inject(forwardRef(()=> StudentService)) private studentService: StudentService,
        @InjectRepository(Subject) private subjectRepository: Repository<Subject>,
        @InjectRepository(Lecturer) private lecturerRepository: Repository<Lecturer>,
        @InjectRepository(Semester) private semesterRepository: Repository<Semester>,
    ) {}

    async getAll(
        { page = 1, limit = 10, offset }: Pagination,
        sort?: Sorting,
        filter?: Filtering[],
    ): Promise<PaginatedResource<Partial<Subject>>> {

        const adjustedOffset = (page - 1) * limit;
    
        let where: any = getWhere(filter);
        
        where = where.reduce((prev, cur) => ({ ...prev, ...cur }), {});
    
        const order = getOrder(sort);
        const [subjects, total] = await this.subjectRepository.findAndCount({
            where,
            relations: { lecturer_code: true, semester_id: true, students: {account_id: true, class_code: true}},
            order,
            take: limit,
            skip: adjustedOffset,
        });
    
        const lastPage = Math.ceil(total / limit);
        const nextPage = page < lastPage ? page + 1 : null;
        const prevPage = page > 1 ? page - 1 : null;
    
        subjects.map((subject) => {
            subject.students.map((student) => {
                delete student.account_id.password;
            });
        });
    
        return {
            data: subjects,
            total,
            limit,
            currentPage: page,
            nextPage,
            prevPage,
            lastPage,
        };
    }

    async getOneByCode(code: string) {
        try {
            const subjectFound = await this.subjectRepository.findOne({
                where: { code: code},
                relations: ['lecturer_code', 'semester_id', 'students', 'students.account_id', 'students.class_code']
            });
            if(!subjectFound) {
                throw new HttpException('Subject is not fount', HttpStatus.NOT_FOUND);
            } else {
                return subjectFound;
            }
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    async getOneById(id: number) {
        try {
            const subjectFound =  await this.subjectRepository.findOne({
                where: { id: id},
                relations: ['lecturer_code', 'semester_id', 'students', 'students.account_id', 'students.class_code' ]
            });
            if(!subjectFound) {
                throw new HttpException('Subject is not fount', HttpStatus.NOT_FOUND);
            } else {
               
                    subjectFound.students.map((student) => {
                        delete student.account_id.password;
                    });
              
                return subjectFound;
            }
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }
    
    async getOneByCodeAndSemester(code: string, semester_id: number) {
        try {
            const subjectFound = await this.subjectRepository.findOne({
                where: { code: code, semester_id: {id: semester_id}},
                relations: ['lecturer_code', 'semester_id', 'students', 'students.account_id', 'students.class_code']
            });
            if(!subjectFound) {
                throw new HttpException('Subject is not fount', HttpStatus.NOT_FOUND);
            } else {
                return subjectFound;
            }
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    async create(createSubjectDto: CreateSubjectDto) {
        try {
            const checkExistSemester = await this.semesterRepository.findOneBy({id: createSubjectDto.semester_id});
            const checkExistLecturer = await this.lecturerRepository.findOneBy({code: createSubjectDto.lecturer_code});
            if(!checkExistSemester) {
                throw new HttpException('Học kỳ không tồn tại', HttpStatus.NOT_FOUND);
            } else if (!checkExistLecturer) {
                throw new HttpException('Giảng viên không tồn tại', HttpStatus.NOT_FOUND);
            } else{
                const {name, code, lecturer_code, semester_id} = createSubjectDto;
                const classCreated = await this.subjectRepository.save({name, code, lecturer_code:{code: lecturer_code}, semester_id: {id: semester_id}});
                return classCreated;
            }
        
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    async createMany(createManySubjectDto: CreateSubjectDto[]) {
        try {
            const results = await Promise.all(createManySubjectDto.map(async (item) => {
                const semester = await this.semesterRepository.findOneBy({name: item.semester_name});
                item.semester_id = semester.id;
                delete item.semester_name;
                return this.create(item);
            }));
            return results;
        } catch (error) {
            // Bắt lỗi nếu có bất kỳ promise nào bị từ chối
            throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async addStudentsToSubject(subject_id: number, student_codes: string[]) {
        const subject = await this.getOneById(subject_id)
        let students =subject.students || [];
        await Promise.all(student_codes.map(async (student_code) => {
            
            const student = await this.studentService.getOneByCode(student_code);
           
            students.push(student);
        }));
        const studentsSet = new Set(students);
        subject.students = Array.from(studentsSet);
        await this.subjectRepository.save(subject);
        return await this.getOneById(subject_id);
    }
    async update(updateSubjectDto: UpdateSubjectDto, id: number) {
        try {
            const subject = await this.getOneById(id);
            const {name, code, lecturer_code, semester_id, is_active} = updateSubjectDto;
            
            await this.subjectRepository.update(id , {name, code, lecturer_code:{code: lecturer_code||subject.lecturer_code.code}, semester_id: {id: semester_id||subject.semester_id.id}, is_active});
            return this.getOneById(id);
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    async updateMany(updateManySubjectDto: UpdateManySubjectDto[]) {
        try {
            
            if(updateManySubjectDto.length > 0) {
                let updatedManySubjects = [];
                await Promise.all(updateManySubjectDto.map(async (item) => {
                    const id = item.id;
                    if(id) {
                        delete item.id;
                        updatedManySubjects.push(await this.update(item, id));
                    }
                }));
                return updatedManySubjects;
            }

        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }
}
