import express from "express";
import userRoutes from "./routes/user.routes";
import ticketroutes from "./routes/ticket.routes";
import {logger} from "./middlewares/logger";
import authRoutes from "./routes/auth.routes";

import errorHandler from "./middlewares/error.middleware";

const app = express();

app.use(express.json());
app.use(logger);
app.use("/api/users", userRoutes);
app.use("/api/tickets",ticketroutes);
app.use("/api/auth",authRoutes);

app.use(errorHandler);



export default app;
