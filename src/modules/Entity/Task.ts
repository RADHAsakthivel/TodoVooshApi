import { UUID,  } from "crypto";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Task{
    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column()
    title:string;

    @Column()
    description:string;

    @Column()
    status:string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt:Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt:Date

    @ManyToOne(() => User, user => user.tasks, { eager: true })
    user: User;
}