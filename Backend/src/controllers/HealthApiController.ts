import { Request, Response } from 'express';

// Component B
const checkHealth = (req: Request, res: Response): void => {
    try {
        res.status(200).send('Task API is healthy');
    } catch (error) {
        console.error('Health check error:', error);
        res.status(500).send('Internal server error');
    }
};

export default checkHealth;
