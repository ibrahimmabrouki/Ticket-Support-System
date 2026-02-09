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
// GET ALL TICKETS
export const getAllTickets = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tickets = await Ticket.find();
    res.status(200).json(tickets);
  } catch (error) {
    next(error);
  }
};

// GET SINGLE TICKET
export const getSingleTicket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
};

// DELETE TICKET
export const deleteTicket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    await ticket.deleteOne();
    res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (error) {
    next(error);
  }
};