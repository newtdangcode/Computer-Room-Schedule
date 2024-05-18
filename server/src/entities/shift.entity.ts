import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: 'shift'})
export class Shift {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ default: true })
  is_active: boolean;
}
