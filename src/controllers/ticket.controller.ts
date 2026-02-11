import { Request, Response, NextFunction } from "express";
import Ticket from "../models/ticket.model";
import User from "../models/user.model";
import {hash, compare} from "bcryptjs";
import { ACCESS_TOKEN_SECRET, TOKEN_EXPIRE } from "../config/jwt";
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


export const getTicketsByStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const statusRequired = req.query.status as string;

        const ticketsByStatus = await Ticket.find({ status: statusRequired });

        if (ticketsByStatus.length === 0) {
            return res.status(404).json({ message: `No tickets with status '${statusRequired}' found` });
        }

        res.status(200).json(ticketsByStatus);

    } catch (error) {
        next(error);
    }
};


export const getTicketsByPriority = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const priorityRequired = req.params.priority as string;

        const ticketsByPriority = await Ticket.find({ priority: priorityRequired });

        if (ticketsByPriority.length === 0) {
            return res.status(404).json({ message: `No tickets with Priority '${priorityRequired}' found` });
        }

        res.status(200).json(ticketsByPriority);

    } catch (error) {
        next(error);
    }
};

export const getTicketByClientId = async (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    try{

        const clientId = req.params.id as string;
        const clientExists = await User.findOne({_id: clientId});

        if (!clientExists) {
            return res
              .status(404)
              .json({ error: `Client with ID '${clientId}' not found` });
        }

        const ticketsById = await Ticket.find({client: clientId});

        if (ticketsById.length === 0) {
            return res.status(404).json({ message: `No tickets for this ID: '${clientId}' found` });
        }

        res.status(200).json(ticketsById);

    } catch (error){
        next(error);
    }
}

export const getTicketByEmployeeId = async (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    try{

        const employeeId = req.params.id as string;
        const employeeExists = await User.findOne({_id: employeeId, role: "employee"});

        if (!employeeExists) {
            return res
              .status(404)
              .json({ error: `Employee with ID '${employeeId}' not found` });
        }

        const ticketsById = await Ticket.find({assignedTo: employeeId});

        if (ticketsById.length === 0) {
            return res.status(404).json({ message: `No tickets for this ID: '${employeeId}' found` });
        }

        res.status(200).json(ticketsById);

    } catch (error){
        next(error);
    }
}
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
// export getTicketsByStatus = async (
//     req: Request,
//     res: Response,
//     next: NextFunction 
//     ) => {
//         try{

//         }catch(error){
//             next(error)
//         }
// };