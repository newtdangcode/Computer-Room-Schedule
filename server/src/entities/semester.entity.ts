import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({name: 'semester'})
export class Semester {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false})
  name: string;

  @Column({ type: 'date' ,nullable: false})
  start_time: Date;

  @Column({ type: 'date' , nullable: false})
  end_time: Date;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
