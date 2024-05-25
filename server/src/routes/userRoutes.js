import express from 'express';
import UserController from '../controllers/userController.js';
const router = express.Router();

router.post('/register', UserController.userRegister);
router.post('/verify-email', UserController.verifyEmail);
router.post('/login', UserController.userLogin);

export default router;
