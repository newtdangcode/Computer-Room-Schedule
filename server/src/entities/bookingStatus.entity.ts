import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: 'booking_status'})
export class BookingStatus {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

}
