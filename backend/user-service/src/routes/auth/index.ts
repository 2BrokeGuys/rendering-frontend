import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth';
import {
  logoutController,
  refreshAccessTokenController,
  signinController,
  signupController
} from '../../controllers/authController';

const authRouter = Router();

authRouter.post('/register', signupController);
authRouter.post('/login', signinController);
authRouter.post('/refresh', refreshAccessTokenController);
authRouter.post('/logout', authMiddleware, logoutController);

export { authRouter };
