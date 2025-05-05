import { Request, Response, NextFunction } from 'express';
import { DatabaseService } from '../db';
import logger from '../Config/loggerConfig';
import DatabaseError from '../ErrorHandlers/DatabaseError';
import ErrorLogger from '../Helper/LoggerFunc';
import ValidationError from '../ErrorHandlers/ValidationError';
import Task from '../Interface/taskInterface';
import checkTaskNameExists from '../Helper/TaskNameExists';
import { JwtPayload } from 'jsonwebtoken';

interface CustomJwtPayload extends JwtPayload {
  id: number
};

// get method by task
const getAllTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const task = await DatabaseService.getTasks();
    const body = task.map((row: object) => {
      return row;
    });
    res.status(200).send(body);
  } catch (error: unknown) {
    // DRY ERROR LOGGER
    ErrorLogger(error, 'getAllTask');
    // Pass error to error handler middleware
    next(new DatabaseError('Unable to fetch tasks', error));
  }
};
// Create a task
const createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      taskName,
      taskPriority,
      taskProgress,
      taskDueDate,
    }: {
      taskName: Task['taskName'];
      taskPriority: Task['taskPriority'];
      taskProgress: Task['taskProgress'];
      taskDueDate: Task['taskDueDate'];
    } = req.body;

    const userId = (req.user as CustomJwtPayload).id;
    const taskNameExists = await checkTaskNameExists(taskName);

    if (taskNameExists) {
      return next(new ValidationError('Task Name Already Exists.'));
    }
    const requestBody = await DatabaseService.addTask(
      taskName,
      taskPriority,
      taskProgress,
      new Date(taskDueDate),
      userId
    );

    logger.info('Task has been successfully been added');
    res.status(201).json({
      success: true,
      message: 'Task has successfully been added',
      data: requestBody,
    });
  } catch (error: unknown) {
    // DRY ERROR LOGGER
    ErrorLogger(error, 'createTask');
    // Pass error to error handler middleware
    next(new DatabaseError('Unable to add tasks', error));
  }
};

const getTaskByTaskName = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { taskName } = req.body;

    // throw error if missing task name
    if (!taskName) {
      return next(new ValidationError('Task Name is required'));
    }
    const requestBody = await DatabaseService.getTaskByTaskName(taskName);

    if (!requestBody) {
      return next(new DatabaseError('Task not found'));
    }
    res.status(200).send(requestBody);
  } catch (error) {
    // DRY ERROR LOGGER
    ErrorLogger(error, 'getTaskByTaskName');
    // Pass error to error handler middleware
    next(new DatabaseError('Unable to fetch the task', error));
  }
};

const isSameDay = (date1: Date, date2: Date) => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
}

const highlightTasksDueToday = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userName = req.params.userName;
    const tasksDueToday: Task[] = [];
    if (!userName) {
      return next(new ValidationError('User Id is required'));
    }

    const result = await DatabaseService.getUserByUserName(userName);

    if (!result) {
      return next(new DatabaseError('User not found'));
    }


    result.tasks.map((taskItem) => {
      if (isSameDay(taskItem.taskDueDate, new Date(Date.now()))) {
        tasksDueToday.push({
          taskName: taskItem.taskName,
          taskPriority: taskItem.taskPriority,
          taskProgress: taskItem.taskProgress,
          taskDueDate: taskItem.taskDueDate,
        });
      }
    });

    
    res.status(200).send(tasksDueToday);
  } catch (error) {
    ErrorLogger(error, 'highlightTasksDueToday');
    next(new DatabaseError('Unable to fetch tasks due today', error))
  }
}

export { getAllTask, createTask, getTaskByTaskName, highlightTasksDueToday };
