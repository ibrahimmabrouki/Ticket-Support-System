import { Request, Response, NextFunction } from "express";
import Ticket from "../models/ticket.model";
import User from "../models/user.model";

export const createTicket = async (
  req: Request,
  res: Response,
  next: NextFunction,
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
export const updateTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status, priority, assignedTo } = req.body;

    const updateData: Partial<{ status: string; priority: string; assignedTo: string }> = {};

    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;

    if (assignedTo) {//here we are checking if the assigneded user is empolyee or not if not then we will return error
      const employee = await User.findOne({ username: assignedTo, role: "employee" });
      if (!employee) {
        return res.status(404).json({ error: `Employee '${assignedTo}' not found` });
      }
      updateData.assignedTo = employee._id.toString();
    }

    const ticket = await Ticket.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    res.status(200).json({
      message: "Ticket updated successfully",
      ticket,
    });
  } catch (error) {
    next(error);
  }
};
