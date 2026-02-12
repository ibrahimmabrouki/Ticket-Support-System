import { Request, Response, NextFunction } from "express";
import Ticket from "../models/ticket.model";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_SECRET,
  TOKEN_EXPIRE,
  REFRESH_TOKEN_SECRET,
} from "../config/jwt";
import { authenticateToken } from "../middlewares/auth.middleware.js";

interface JwtUserPayload {
  id: string;
  username: string;
  role: string;
}

//now we can user req.user
interface AuthRequest extends Request {
  user?: JwtUserPayload;
}

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

    //commanded temporarly
    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    const clientUser = await User.create({
      name,
      email,
      password: hashedPassword,
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
    const userExists = await User.findOne({ username });
    if (!userExists) return res.status(404).json({ error: "User not found" });

    // commanded temporarly
     const passValid = await bcrypt.compare(password.trim(), userExists.password);
     if (!passValid) return res.status(401).json({ error: "Invalid password" });

    //const payload = { id: user._id, username: user.username, role: user.role };
    // const options: jwt.SignOptions = { expiresIn: TOKEN_EXPIRE as any};
    // const token = jwt.sign(payload, ACCESS_TOKEN_SECRET, options);

    // if (userExists.password.trim() !== password) {
    //   return res.status(401).json({ error: "Invalid password" });
    // }
    const payload: JwtUserPayload = {
      id: userExists._id.toString(),
      username: userExists.username,
      role: userExists.role,
    };

    //here we need to send it back to the client
    const accessToken = generateAccessToken(payload);
    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET);
    await User.findByIdAndUpdate(
      userExists._id,
      { refreshToken },
      { new: true }
    );
    
    return res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};


export const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.body.token;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as JwtUserPayload;

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const payload: JwtUserPayload = {
      id: user._id.toString(),
      username: user.username,
      role: user.role,
    };

    //we also need to send it back to the client
    const newAccessToken = generateAccessToken(payload);

    return res.status(200).json({ accessToken: newAccessToken });

  } catch (err) {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    next(err);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try{
     //here the client will send the refreshToken and based on that we will find the user
     //then we delete this refresh token form their objects in DB
     
     const refreshToken = req.body.token;
     if(!refreshAccessToken){
      res.status(403).send({msg: "You dont have refresh key"});
     }

     const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as JwtUserPayload;
     const user = await User.findById(decoded.id);

     if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.refreshToken?.trim() !== refreshToken.trim()) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    await User.findByIdAndUpdate(user._id, {refreshToken: null}, {new: true})
    return res.status(200).send("You logged out");

  } catch(err){
    next(err);
  }
}
function generateAccessToken(payload: JwtUserPayload) {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: TOKEN_EXPIRE as any,
  });
}