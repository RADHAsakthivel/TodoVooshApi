import { Response, Request, NextFunction } from "express";
import { Controller, Get, Post } from "../shared/decorators";
import { LoginService } from "../services";
import {
  ConflictResponse,
  InternalServerResponse,
  NotFoundResponse,
  SucessResponse,
  UnAuthorizedResponse,
} from "../shared/response";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import passport from "passport";

@Controller()
export class LoginController {
  loginService: LoginService;
  constructor(_loginService: LoginService) {
    this.loginService = _loginService;
  }
  @Get("/health", false)
  async health(req: Request, res: Response): Promise<any> {
    return res
      .status(200)
      .send(new SucessResponse("application working fines"));
  }

  @Post("/signup", false)
  async signUp(req: Request, res: Response): Promise<any> {
    const userData = req.body;
    const isUserExist = await this.loginService.findUser(userData);
    if (isUserExist) {
      return res.status(409).send(new ConflictResponse("User already exist"));
    }
    const createdUser = await this.loginService.createUser(userData);
    return res
      .status(201)
      .send(new SucessResponse("Sucessfully created", createdUser));
  }

  @Post("/login", false)
  async login(req: Request, res: Response): Promise<any> {
    const userData = req.body;
    const existingUser = await this.loginService.findUser(userData);
    if (!existingUser) {
      return res.status(404).send(new NotFoundResponse("User not found"));
    }
    const isMatch = await bcrypt.compare(
      userData.passWord,
      existingUser.passWord
    );
    if (!isMatch) {
      return res
        .status(401)
        .send(new UnAuthorizedResponse("Incorrect password"));
    }
    const jwtSecret = process.env.TODO_JWT_SECRET as string;
    const jwtExpiryTime = process.env.TODO_JWT_EXPIRY || ("1d" as string);
    const token = jwt.sign({ id: existingUser.id }, jwtSecret, {
      expiresIn: jwtExpiryTime,
    });
    const decode = jwt.decode(token) as JwtPayload;
    console.log("decode =>", decode, (decode.exp || 0) - (decode.iat || 0));
    return res
      .status(200)
      .send(new SucessResponse("Logined sucessfully", token));
  }

  @Get("/auth/google", false)
  googleAuth(req: Request, res: Response, next: NextFunction) {
    passport.authenticate("google", { scope: ["profile", "email"] })(
      req,
      res,
      next
    );
  }

  @Get("/auth/google/callback", false)
  googleAuthCallBack(req: Request, res: Response, next: NextFunction) {
    passport.authenticate(
      "google",
      { failureRedirect: "/" },
      async(err, user, info) => {
        if (err) return next(err);
        if (!user) return res.redirect("/");

        req.logIn(user, (err) => {
          if (err) return next(err);
          const jwtSecret = process.env.TODO_JWT_SECRET as string;
          const jwtExpiryTime = process.env.TODO_JWT_EXPIRY || "1d";
          const token = jwt.sign({ id: user.id }, jwtSecret, {
              expiresIn: jwtExpiryTime,
          });
          return res.status(200).send(new SucessResponse("Login successful", { token }));
          // return res.redirect("/dashboard");
        });
      }
    )(req, res, next);
  }

  @Get("/logout")
  async logOut(req: Request, res: Response) {
    req.logout((err) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .send(new InternalServerResponse("Logout failed"));
      }
      res.redirect("/");
    });
  }
}
