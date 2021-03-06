import express from 'express';
import { config } from 'dotenv';
import queryRouter from './routes/api/query';
import cors from 'cors';

config();

const port = process.env.PORT || 5001;
const app = express();
app.use(express.json());
app.use(cors());
app.use('/api', queryRouter);

app.listen(port, () => {
  console.log(
    ` ${process.env.APP_NAME}  application is running on port ${port}`
  );
});
