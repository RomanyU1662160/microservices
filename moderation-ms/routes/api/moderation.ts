import express from 'express';
import { config } from 'dotenv';
import { IComment, IPost, Status } from '../../interfaces/interfaces';
import fetch from 'node-fetch';

config();

const post_ms_url = process.env.POStS_MS_URL; //5000
const comments_ms_url = process.env.COMMENTS_MS_URL; //5001
const query_ms_url = process.env.QUERY_MS_URL; //5002
const moderation_ms_url = process.env.MODERATION_MS_URL; //5003
const event_bus_ms = process.env.EVENT_BUS_MS_URL; //5005

let postsQuery: Array<IPost> = [];
let commentQuery: Array<IComment> = [];

function filterResult(target: any, rule: string) {
  return target.includes(rule) ? false : true;
}

const router = express.Router();

router.post('/newComment', async (req, res, next) => {
  let { payload } = req.body;
  console.log('payload in moderation :::->>>', payload);
  console.log('moderation/newComment endpoint called   ');
  const isOkay = filterResult(payload.content, 'orange');
  isOkay
    ? (payload.status = Status.APPROVED)
    : (payload.status = Status.REJECTED);
  console.log('Updated moderated status (payload):::->>>', payload);

  await fetch(`${event_bus_ms}/events`, {
    method: 'POST',
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
    body: JSON.stringify({ type: 'comment_status_updated', payload }),
  });
  next();
});

export default router;
