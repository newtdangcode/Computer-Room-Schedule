import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: 'room_status'})
export class RoomStatus {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ default: true })
  is_active: boolean;
}
