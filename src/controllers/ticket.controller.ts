import { Request, Response, NextFunction } from "express";
import Ticket from "../models/ticket.model";

export const createTicket = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const ticket = await Ticket.create(req.body);
        res.status(201).send("ticket added successfuly");
    } catch (error) {
        next(error);
    }
};
