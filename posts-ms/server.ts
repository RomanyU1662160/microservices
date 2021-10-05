import express from 'express';
import { config } from 'dotenv';
import postsRouter from './routes/apis/posts';
import cors from 'cors';

config();

const port = process.env.PORT || 5000;

const app = express();
app.use(cors());

app.use(express.json());
app.use('/api', postsRouter);

app.listen(port, () => {
  console.log('version:::->>> 0.0.2');
  console.log(`${process.env.APP_NAME} application is running on port ${port}`);
});
