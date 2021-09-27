import express from 'express';
import { config } from 'dotenv';
import moderationRouter from './routes/api/moderation';

config();
const app = express();
app.use(express.json());

app.use('/api', moderationRouter);

const port = process.env.PORT || 5003;

app.listen(port, () => {
  console.log(
    ` ${process.env.APP_NAME}  application is running on port ${port}`
  );
});
