import express from 'express';
import userController from '../controllers/userController'
import authMiddleware from '../middlewares/authMiddleware';
const router = express.Router();

router.post('/signup', userController.signupUser)
router.post('/login', userController.loginUser)
router.post('/createTask', authMiddleware, userController.createTask)
router.get('/fetchTasks/:userId', authMiddleware, userController.fetchTasks)
router.delete('/deleteTask', authMiddleware, userController.deleteTask)
router.post('/logout', userController.logout)

export default router;
