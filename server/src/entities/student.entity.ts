import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, BaseEntity, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { Class } from './class.entity';
import { Account } from './account.entity';
import { Subject } from './subject.entity';
@Entity({name: "student"})
export class Student extends BaseEntity {
  @PrimaryGeneratedColumn()
  code: string;

  @ManyToOne(() => Account, account => account.id)
  @JoinColumn({name:"account_id"})
  account_id: Account;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true })
  phone_number: string;

  @ManyToOne(() => Class, _class => _class.students)
  @JoinColumn({name: "class_code"})
  class_code: Class;

  @OneToMany(()=>Subject, (subjects)=>subjects.students)
  @JoinTable({
    name: 'subject_student',
    joinColumn: { name: 'student_code', referencedColumnName: 'code' },
    inverseJoinColumn: { name: 'subject_id' }
  })
  subjects: Subject[];
  // @ManyToMany(() => Subject, {onDelete: 'NO ACTION', onUpdate: 'NO ACTION'})
  // @JoinTable()
  // subjects: Subject[];
  // @ManyToMany(
  //   ()=>Subject,
  //   subject => subject.students,
  //   {onDelete:'NO ACTION', onUpdate:'NO ACTION'})
  // @JoinTable({
  //   name: 'subject_student',
  //   joinColumn: { name: 'student_code', referencedColumnName: 'code' },
  //   inverseJoinColumn: { name: 'subject_id', referencedColumnName: 'id' }
  // })
  // subjects?: Subject[];

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
