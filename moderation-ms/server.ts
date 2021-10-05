import express from 'express';
import { config } from 'dotenv';
import moderationRouter from './routes/api/moderation';
import cors from 'cors';

config();

const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cors(), () => [console.log('APP is using cors ')]);

app.use('/api', moderationRouter);
console.log('APP is using cors ');
app.listen(port, () => {
  console.log('version:::->>> 0.0.2');
  console.log(`${process.env.APP_NAME} application is running on port ${port}`);
});
