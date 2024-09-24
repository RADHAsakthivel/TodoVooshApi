import { Request, Response } from "express";

export interface IController {
    [method: string]: (req: Request, res: Response) => void; // Allow any method with the correct signature
}