import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { UUID } from "typeorm/driver/mongodb/bson.typings";

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id:UUID;

    @Column()
    name:string;

    @Column()
    email:string;
}