import { Router } from "express";
import {createTicket, getTicketsByStatus, getTicketsByPriority, getTicketByClientId, getTicketByEmployeeId} from '../controllers/ticket.controller';

const router = Router();

router.post('/', createTicket);
router.get('/status', getTicketsByStatus);
router.get('/priority/:priority', getTicketsByPriority);
router.get("/client/:id", getTicketByClientId);
router.get("/employee/:id", getTicketByEmployeeId);


export default router;