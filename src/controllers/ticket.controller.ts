import { Request, Response, NextFunction } from "express";
import Ticket from "../models/ticket.model";
import User from "../models/user.model";

export const createTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { client, assignedTo, ...rest } = req.body;

    const clientExists = await User.findOne({
      username: client,
      role: "client",
    });

    const assignedToExists = await User.findOne({
      username: assignedTo,
      role: "employee",
    });

    if (!clientExists && !assignedToExists) {
      return res.status(404).json({
        error: `Both Client '${client}' and Employee '${assignedTo}' not found`,
      });
    }

    if (!clientExists) {
      return res
        .status(404)
        .json({ error: `Client with username '${client}' not found` });
    }

    if (!assignedToExists) {
      return res
        .status(404)
        .json({ error: `Employee with username '${assignedTo}' not found` });
    }

    const ticket = await Ticket.create({
      client: clientExists._id,
      assignedTo: assignedToExists._id,
      ...rest,
    });

    res.status(201).json({ message: "Ticket added successfully", ticket });
  } catch (error) {
    next(error);
  }
};
