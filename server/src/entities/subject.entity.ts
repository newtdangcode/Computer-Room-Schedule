import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Lecturer } from './lecturer.entity';
import { Semester } from './semester.entity';
import { Student } from './student.entity';

@Entity({name: 'subject'})
export class Subject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false})
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false})
  code: string;

  @ManyToOne(() => Lecturer, lecturer => lecturer.code)
  @JoinColumn({ name: 'lecturer_code'})
  lecturer_code: Lecturer;

  @ManyToOne(() => Semester, semester => semester.id)
  @JoinColumn({ name: 'semester_id'})
  semester_id: Semester;

  @ManyToMany(()=> Student, (students) => students.subjects)
  @JoinTable({
    name: 'subject_student',
    joinColumn: { name: 'subject_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'student_code'}
  })
  students: Student[];
  // @ManyToMany(()=>Student ,{onDelete: 'NO ACTION', onUpdate: 'NO ACTION'})
  // @JoinTable()
  // students: Student[];
  // @ManyToMany(
  //   () => Student,
  //   student => student.subjects,
  //   {onDelete: 'NO ACTION', onUpdate: 'NO ACTION'}
  // )
  // @JoinTable({
  //   name: 'subject_student',
  //   joinColumn: { name: 'subject_id', referencedColumnName: 'id' },
  //   inverseJoinColumn: { name: 'student_code', referencedColumnName: 'code' }
  // })
  //students?: Student[];
  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

}
