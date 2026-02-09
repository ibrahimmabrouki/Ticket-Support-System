import { Router } from "express";
import {
    createTicket,
    getAllTickets,
    getSingleTicket,
    deleteTicket,

} from '../controllers/ticket.controller';

const router = Router();

router.post('/', createTicket);
router.get("/", getAllTickets);
router.get("/:id", getSingleTicket);
router.delete("/:id", deleteTicket);


export default router;