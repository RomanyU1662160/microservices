import express from 'express';
import { config } from 'dotenv';
import eventBusRouter from './routes/api/event-bus';
import cors from 'cors';

config();

const port = process.env.PORT || 5005;
const app = express();
app.use(cors());

app.use(express.json());
app.use('/api', eventBusRouter);

app.listen(port, () => {
  console.log(
    `${process.env.APP_NAME}  application is running on port ${port}`
  );
});
