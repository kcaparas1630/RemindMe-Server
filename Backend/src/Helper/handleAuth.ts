import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import User from '../Interface/userInteface';
import DoneFunction from '../Interface/doneFuncType';
import { DatabaseService } from '../db';

// Check for JWT_SECRET early
// eslint-disable-next-line no-undef
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}

// JWT Strategy configuration
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

// Verify user function
const verifyUser = async (payload: JwtPayload, done: DoneFunction) => {
  try {
    if (!payload.sub) {
      return done(null, false, { message: 'Invalid token payload' });
    }

    const userResult = await DatabaseService.getUserByUserName(payload.sub);

    if (!userResult) {
      return done(null, false, { message: 'User not found' });
    }

    return done(null, userResult);
  } catch (error) {
    return done(error instanceof Error ? error : new Error('Unknown error occurred'));
  }
};

// Initialize JWT Strategy
passport.use(new JwtStrategy(jwtOptions, verifyUser));

// Middleware to protect routes
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: Error | null, user: User | false) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = user;
    next();
  })(req, res, next);
};

export default authenticateJWT;
