import { Router } from "express";
import {createTicket , updateTicket} from '../controllers/ticket.controller';

const router = Router();

router.post('/', createTicket);
router.put('/:id', updateTicket);
export default router;