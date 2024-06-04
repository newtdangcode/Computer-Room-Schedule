import exp from "constants";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Room } from "./room.entity";
import { Shift } from "./shift.entity";
import { Lecturer } from "./lecturer.entity";
import { Subject } from "./subject.entity";
import { BookingStatus } from "./bookingStatus.entity";
import { Semester } from "./semester.entity";
import { Employee } from "./employee.entity";

@Entity({name: "booking"})
export class Booking extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Room, room => room.code)
    @JoinColumn({name:"room_code"})
    room_code: Room;

    @Column({name:"date", nullable: false })
    date: Date;

    @ManyToOne(() => Shift, shift => shift.id)
    @JoinColumn({name:"shift_id"})
    shift_id: Shift;

    @ManyToOne(() => Lecturer, lecturer => lecturer.code)
    @JoinColumn({name:"lecturer_code"})
    lecturer_code: Lecturer;

    @ManyToOne(() => Subject, subject => subject.id)
    @JoinColumn({name:"subject_id"})
    subject_id: Subject;

    @ManyToOne(() => BookingStatus, booking_status => booking_status.id)
    @JoinColumn({name:"status_id"})
    status_id: BookingStatus;

    @ManyToOne(() => Semester, semester => semester.id)
    @JoinColumn({name:"semester_id"})
    semester_id: Semester;

    @ManyToOne(() => Employee, employee => employee.code)
    @JoinColumn({name:"employee_code"})
    employee_code: Employee;

    @Column({ type: 'boolean', default: true })
    is_active: boolean;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;


}