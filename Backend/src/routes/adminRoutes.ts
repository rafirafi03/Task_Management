import express from 'express';
const router = express.Router();
import adminController from '../controllers/adminController';

router.post('/login', adminController.login);

export default router;
