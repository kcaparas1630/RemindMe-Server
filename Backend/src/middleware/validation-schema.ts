import { AnySchema } from 'yup';
import { Request, Response, NextFunction } from 'express';

// validate the router to protect any misinput data.
const validate = (schema: AnySchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.validate({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (e: unknown | string | null) {
      if (e instanceof Error) {
        res.status(400).send(e.message);
      } else if (typeof e === 'string') {
        res.status(400).send(e);
      } else {
        res.status(400).send('An unknown error occurred');
      }
    }
  };
};

export default validate;
