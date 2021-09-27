import express from 'express';
import { config } from 'dotenv';
import commentsRouter from './routes/apis/comments';

config();
const app = express();
app.use(express.json());

app.use('/api', commentsRouter);

const port = process.env.PORT || 5001;

app.listen(port, () => {
  console.log(
    `${process.env.APP_NAME}  application is running on port ${port}`
  );
});
