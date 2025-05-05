import { Router, Request, Response } from 'express';
import { getAllUser, getUserByUserName, loginUser, registerUser } from '../controllers/UserController';
import validate from '../middleware/validation-schema';
import { userRegisterValidationSchema, userLoginValidationSchema } from '../dto/createUser-schema';
import rateLimit from 'express-rate-limit';
import authenticateJWT from '../Helper/handleAuth';

const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // limit each ip to 10 requests per window/minute
    message: 'Too many login attempts, please try again later'
});
const router = Router();

router.route('/user').get(getAllUser);

router.route('/user/register').post(validate(userRegisterValidationSchema), registerUser);
router.route('/user/login').post(loginLimiter, validate(userLoginValidationSchema), loginUser);

// protected route with jwt tokens
router.get('/dashboard', authenticateJWT, (req: Request, res: Response) => {
    res.json({ message: 'Access granted to protected route' });
  });
// special getter for getting username
router.get('/user/:userName', getUserByUserName);

export default router;
