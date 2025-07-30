import express from 'express';
import {displayAllUsers} from '../controllers/userController.js'; 




const router = express.Router();

router.get('/fetchAll', displayAllUsers);

export default router;