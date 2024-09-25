import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UnAuthorizedException } from "../CustomErrors";

export const authGuard = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  console.log("token =>",req.headers)
  const jwtSecrete = process.env.TODO_JWT_SECRET as string;
  if (!token) {
    throw new UnAuthorizedException("Authorization token is required");
  }

  try {
    const decode = jwt.verify(token, jwtSecrete) as JwtPayload;
    console.log("decode =>",decode,(decode.exp || 0) - (decode.iat || 0));
    req.user = decode;
    next();
  } catch (error: any) {
    console.log(error)
    if(error.name === "TokenExpiredError"){
      throw new UnAuthorizedException("Token expired")
    }
    throw new UnAuthorizedException("Invalid token");
  }
};
