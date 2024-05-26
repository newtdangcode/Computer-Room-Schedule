import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, BaseEntity, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Lecturer } from './lecturer.entity';
import { Student } from './student.entity';
@Entity({name: "class"})
export class Class extends BaseEntity {
  @PrimaryGeneratedColumn()
  code: string;

  @Column({ nullable: false })
  name: string;

  @ManyToOne(() => Lecturer, lecturer => lecturer.code)
  @JoinColumn({ name: 'lecturer_code' })
  lecturer_code: Lecturer;

  @OneToMany(() => Student, student => student.class_code)
  students: Student[];

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}