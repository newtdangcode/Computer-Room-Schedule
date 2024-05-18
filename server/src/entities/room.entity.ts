import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from './employee.entity';
import { RoomStatus } from './roomStatus.entity';

@Entity('room')
export class Room {
  @PrimaryGeneratedColumn()
  code: string;

  @Column({ type: 'varchar', length: 255 , nullable: true})
  name: string;

  @Column({ type: 'int', nullable: true })
  machineQuantity: number;

  @ManyToOne(() => Employee, employee => employee.code)
  @JoinColumn({ name: 'employee_code'})
  employee_code: Employee;

  @ManyToOne(() => RoomStatus, room_status => room_status.id)
  @JoinColumn({ name: 'status_id'})
  status_id: RoomStatus;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

}
