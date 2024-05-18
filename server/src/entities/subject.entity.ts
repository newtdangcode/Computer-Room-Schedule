import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Lecturer } from './lecturer.entity';
import { Semester } from './semester.entity';

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

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

}
