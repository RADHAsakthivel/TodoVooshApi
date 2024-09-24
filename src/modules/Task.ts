import { UUID,  } from "crypto";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Task{
    @PrimaryGeneratedColumn()
    id:string;

    @Column()
    title:string;

    @Column()
    description:string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt:Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt:Date
}