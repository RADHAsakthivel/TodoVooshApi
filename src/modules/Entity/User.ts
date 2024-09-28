import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Task } from "./Task";

@Entity()
export class User{
    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column({ nullable: true })
    firstName?:string;

    
    @Column({ nullable: true })
    lastName?:string;

    @Column({ unique: true })
    email:string;

    @Column()
    password:string;

    @OneToMany(() => Task, task => task.user)
    tasks: Task[];
}