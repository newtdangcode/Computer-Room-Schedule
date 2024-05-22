import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, BaseEntity, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Account } from './account.entity';
import { join } from 'path';

@Entity({name: "lecturer"})
export class Lecturer extends BaseEntity {
  @PrimaryGeneratedColumn()
  code: string;

  @ManyToOne(() => Account, account => account.id)
  @JoinColumn({ name: 'account_id' })
  account_id: Account;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true })
  phone_number: string;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
