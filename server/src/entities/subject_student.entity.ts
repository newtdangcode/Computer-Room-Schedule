import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinColumn } from 'typeorm';
import { Subject } from './subject.entity';
import { Student } from './student.entity';
@Entity({name: 'subject_student'})
export class SubjectStudent {
    @ManyToMany(() => Subject, subject => subject.id)
    @JoinColumn({ name: 'subject_id' })
    subject_id: Subject;
    
    @ManyToMany(() => Student, student => student.code)
    @JoinColumn({ name: 'student_code' })
    student_code: Student;

 
}
