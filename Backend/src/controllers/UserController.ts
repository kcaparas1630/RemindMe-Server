import { Request, Response, NextFunction } from 'express';
import { DatabaseService } from '../db';
import dotenv from 'dotenv';
import { hashPassword, verifyHashPassword } from '../Helper/hash';
import checkUserExists from '../Helper/UserExists';
import jwt from 'jsonwebtoken';
import User from '../Interface/userInteface';
import ErrorLogger from '../Helper/LoggerFunc';
import DatabaseError from '../ErrorHandlers/DatabaseError';
import ValidationError from '../ErrorHandlers/ValidationError';
import logger from '../Config/loggerConfig';

dotenv.config();
/**
 *
 *  GET METHOD FOR USERS
 * @param {Request} req
 * @param {Response} res
 * @return {*}  {Promise<void>}
 */
const getAllUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userQuery = await DatabaseService.getUsers();
    const body = userQuery.map((row: object) => {
      return row;
    });
    res.status(200).send(body);
  } catch (error: unknown) {
    // DRY ERROR LOGGER
    ErrorLogger(error, 'getAllUser');
    // Pass error to error handler middleware
    next(new DatabaseError('Unable to fetch Users', error));
  }
  
};
/**
 *
 *  GET METHOD WITH ID
 * @param {Request} req
 * @param {Response} res
 * @return {*}  {Promise<void>}
 */
const getUserByUserName = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userName = req.params.userName;

    if (!userName) {
      return next(new ValidationError('User Id is required'));
    }

    const result = await DatabaseService.getUserByUserName(userName);

    if (!result) {
      return next(new DatabaseError('User not found'));
    }

    res.status(200).json(result);
  } catch (error: unknown) {
    // DRY ERROR LOGGER
    ErrorLogger(error, 'getUserByUserName');
    // Pass error to error handler middleware
    next(new DatabaseError('Unable to fetch the user', error));
  }
};
/**
 *
 *  POST METHOD FOR USER
 * @param {Request} req
 * @param {Response} res
 * @return {*}  {Promise<void>}
 */
const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      firstName,
      lastName,
      userName,
      userPassword,
      userEmail,
    }: {
      // Made it as User['firstName'] so that when we change anything in the interface, it will not cause any error, or not be a hassle to change everything.
      firstName: User['firstName'];
      lastName: User['lastName'];
      userName: User['userName'];
      userPassword: User['userPassword'];
      userEmail: User['userEmail'];
    } = req.body;
    console.log('Received data:', { firstName, lastName, userName, userPassword, userEmail });
    const hashedPasssword = await hashPassword(userPassword);
    const lowerCaseEmail = userEmail.toLowerCase();
    console.log(lowerCaseEmail);
    const userExists = await checkUserExists(userName, userEmail);

    // if user exists send status 403 (Forbidden)
    if (userExists) {
      return next(new ValidationError('User Already Exists'));
    }

    const result = await DatabaseService.addUser(
      firstName,
      lastName,
      userName,
      hashedPasssword,
      lowerCaseEmail
    );

    logger.info('User has been successfully been added');
    // Send success response
    res.status(201).json({
      success: true,
      message: 'User has succesfully been added',
      data: result,
    });
  } catch (error: unknown) {
    // DRY ERROR LOGGER
    ErrorLogger(error, 'registerUser');
    // Pass error to error handler middleware
    next(new DatabaseError('Unable to add user', error));
  }
};
/**
 *
 *  ALSO A POST METHOD FOR USER BUT FOR LOGIN PURPOSES
 * @param {Request} req
 * @param {Response} res
 * @return {*}  {Promise<void>}
 */
const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // eslint-disable-next-line no-undef
    if (!process.env.JWT_SECRET) {
      res.status(500).send('Server configuration error');
      return;
    }
    const {
      userName,
      userPassword,
    }: { userName: User['userName']; userPassword: User['userPassword'] } = req.body;
    console.log('Received Data: ', userName, userPassword);
    // Checks if user exists in the postgresql database using the userName params
    const userResult = await DatabaseService.getUserByUserName(userName);
    // check the result if not null or empty string
    if (!userResult) {
      return next(new ValidationError('Invalid Credentials'));
    }
    // assigns the userResult into a user variable.
    const user: User = userResult;

    // verify password
    const isPasswordCorrect = await verifyHashPassword(userPassword, user.userPassword);

    if (!isPasswordCorrect) {
      return next(new ValidationError('Invalid Credentials'));
    }

    const token = jwt.sign(
      {
        sub: user.userName,
        email: user.userEmail,
      },
      // eslint-disable-next-line no-undef
      process.env.JWT_SECRET as string,
      { expiresIn: '20m' }
    );

    res.status(200).json({ token });
  } catch (error: unknown) {
    // DRY ERROR LOGGER
    ErrorLogger(error, 'loginUser');
    // Pass error to error handler middleware
    next(new DatabaseError('Unable to login user', error));
  }
};
export { getAllUser, getUserByUserName, loginUser, registerUser };
