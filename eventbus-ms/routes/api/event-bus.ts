import express from 'express';
import { config } from 'dotenv';
import fetch from 'node-fetch';

config();

const post_ms_url = process.env.POStS_MS_URL; //5000
const comments_ms_url = process.env.COMMENTS_MS_URL; //5001
const query_ms_url = process.env.QUERY_MS_URL; //5002
const moderation_ms_url = process.env.MODERATION_MS_URL; //5003
const event_bus_ms = process.env.EVENT_BUS_MS_URL; //5005

const router = express.Router();

const events: Array<object> = [];

router.post('/events', async (req, res, next) => {
  let { type, payload } = req.body;

  events.push({ type, payload });

  console.log('payload:::->>>', payload);
  switch (type) {
    case 'postCreated':
      console.log(`EVENT_BUSS is Processing EVENT : ${type}`);
      await fetch(`${query_ms_url}/newPost`, {
        method: 'POST',
        body: JSON.stringify({ type, payload }),
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      });
      next();
      break;

    case 'commentCreated':
      let { id, postID, content, status } = payload;

      console.log('comment Created payload in event_bus :::->>>', payload);

      await fetch(`${query_ms_url}/newComment/${postID}`, {
        method: 'POST',
        body: JSON.stringify({ type: 'commentCreated', payload }),
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      });

      await fetch(`${post_ms_url}/${postID}/comments/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'add_comment_to_post',
          payload,
        }),
      });
      await fetch(`${moderation_ms_url}/newComment`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({ type: 'commentCreated', payload }),
      });

      next();
      break;

    case 'comment_status_updated':
      console.log('comment_status_updated received in event_bus');
      let postId = req.body.payload.postID;
      await fetch(`${query_ms_url}/comments/update/${postId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'update_comment_status',
          payload,
        }),
      });

      await fetch(
        `${post_ms_url}/${postId}/comments/update/${req.body.payload.id}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'add_comment_to_post',
            payload,
          }),
        }
      );

      next();

    default:
      res.send('Break...');
  }
});

router.get('/events', (req, res, next) => {
  res.send(events).status(200);
});
export default router;
