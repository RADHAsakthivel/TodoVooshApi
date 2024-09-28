export class TaskDto{
    id?:string;
    userId?:string;
    title:string;
    description:string;
    status:string;
    createdAt?:Date;
    updatedAt?:Date;
}