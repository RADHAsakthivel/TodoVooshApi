import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User{
    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column({ nullable: true })
    name?:string;

    @Column({ unique: true })
    email:string;

    @Column()
    passWord:string;
}