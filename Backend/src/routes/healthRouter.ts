import express from 'express';
import checkHealth from '../controllers/HealthApiController';

const router = express.Router();

router.get('/health', checkHealth);

export default router;
