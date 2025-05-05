import dotenv from 'dotenv';
import app from './express';
import { env } from 'process';

dotenv.config();

const port = env.PORT || 3000;

app.listen(port, () => {
  console.log(`[Server]: Server is running at http://localhost:${port}`);
});
