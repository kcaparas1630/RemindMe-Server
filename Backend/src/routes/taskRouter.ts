import { Router } from 'express';
import { getAllTask, createTask, getTaskByTaskName, highlightTasksDueToday } from '../controllers/TaskController';
import validate from '../middleware/validation-schema';
import taskValidationSchema from '../dto/createTask-schema';
import handleAuth from '../Helper/handleAuth';
const router = Router();

router.route('/task').get(handleAuth, getAllTask).post(handleAuth, validate(taskValidationSchema), createTask);

// special getter for task name
router.get('/task/name/:name', handleAuth, getTaskByTaskName);

router.get('/task/user/:userName', handleAuth, highlightTasksDueToday);

export default router;
