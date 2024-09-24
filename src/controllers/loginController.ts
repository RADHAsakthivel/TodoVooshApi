import { Response,Request } from "express";
import { Get, Post } from "../decorators/http";

export default class LoginController{

    @Get("/health")
    health(req: Request, res: Response){
        res.send("application working fines")
    }

    @Post("/login")
    login(req:Request,res:Response){
        res.send("login working fine");
    }
}