import { Request, Response, NextFunction } from "express";
import Ticket from "../models/ticket.model";
import User from "../models/user.model";
import {hash, compare} from "bcryptjs";
import { ACCESS_TOKEN_SECRET, TOKEN_EXPIRE } from "../config/jwt";
export const register =  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) =>{

};