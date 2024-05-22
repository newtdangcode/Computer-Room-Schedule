import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, BaseEntity, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Class } from './class.entity';
import { Account } from './account.entity';
@Entity({name: "student"})
export class Student extends BaseEntity {
  @PrimaryGeneratedColumn()
  code: string;

  @ManyToOne(() => Account, account => account.id)
  account_id: Account;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true })
  phone_number: string;

  @ManyToOne(() => Class, _class => _class.code)
  @JoinColumn({name: "class_code"})
  class_code: Class;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
