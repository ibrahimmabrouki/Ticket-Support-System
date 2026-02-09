import { Request, Response, NextFunction } from "express";

export const logger = (req: Request, res: Response, next: NextFunction) => {
  const method = req.method;
  const url = req.originalUrl;
  const time = new Date().toISOString();

  console.log(`[${time}] ${method} ${url}`);

  next();
};
