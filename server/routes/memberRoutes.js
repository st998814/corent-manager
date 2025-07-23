import express from 'express';
import { sendInvitation ,acceptInvitation} from '../controllers/memberController.js';



const router = express.Router();

router.post('/invite', sendInvitation);
router.patch('/invite/accept', acceptInvitation);

export default router;