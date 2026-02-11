import { Request, Response, NextFunction } from "express";
import Ticket from "../models/ticket.model";
import User from "../models/user.model";
import { hash, compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, TOKEN_EXPIRE } from "../config/jwt";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password, phone, username, role = "client" } = req.body;

  try {
    const clientExists = await User.findOne({ username });

    if (clientExists) {
      return res
        .status(409)
        .json({ error: `Client with username '${username}' already exists` });
    }

    const hashedPassword = await hash(password.trim(), 10);

    const clientUser = await User.create({
      name,
      email,
      password: hashedPassword.trim(),
      phone,
      username,
      role,
    });


    res.status(201).json(clientUser);
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const passValid = await compare(password.trim(), user.password);
    console.log(`usedb pass ${user.password}`);
    console.log(passValid);
    
    if (!passValid) return res.status(401).json({ error: "Invalid password" });

    const payload = { id: user._id, username: user.username, role: user.role };
    const options: jwt.SignOptions = { expiresIn: TOKEN_EXPIRE as any};
    const token = jwt.sign(payload, ACCESS_TOKEN_SECRET, options);

    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    next(error);
  }
};
