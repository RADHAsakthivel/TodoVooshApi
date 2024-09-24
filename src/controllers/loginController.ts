import { Response,Request } from "express";
import { Controller, Get, Post } from "../decorators";
import {LoginService} from "../services";

@Controller()
export class LoginController{
    loginService:LoginService
    constructor(_loginService:LoginService){
        this.loginService = _loginService;
    }
    @Get("/health")
    async health(req: Request, res: Response){
        return res.send("application working fines")
    }

    @Post("/signup")
    async signUp(req:Request,res:Response){
        const userData = req.body;
        const isUserExist = await this.loginService.findUser(userData);
        if(isUserExist) return res.status(409).send({message:"user already exisit",status:409,data:userData});

        const createdUser = await this.loginService.createUser(userData);
        return res.status(201).send({message:"SUCESS",status:201,data:createdUser});
    }

    @Post("/login")
    async login(req:Request,res:Response){
        res.send("login working fine");
    }
}