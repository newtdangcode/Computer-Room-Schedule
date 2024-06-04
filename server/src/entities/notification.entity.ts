import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Account } from "./account.entity";

@Entity({name: "notification"})
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Account, account => account.id)
    @JoinColumn({ name: 'account_id' })
    account_id: Account;
    
    @Column()
    content: string;

    @Column({default: true})
    unread: boolean;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}