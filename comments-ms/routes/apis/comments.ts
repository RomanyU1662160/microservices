import express from 'express';
import { config } from 'dotenv';
import fetch from 'node-fetch';
import { IComment, Status } from '../../interfaces/interfaces';
import { posts } from '../../../Common/DB/mockData';

config();

const post_ms_url = process.env.POStS_MS_URL; //5000
const comments_ms_url = process.env.COMMENTS_MS_URL; //5001
const query_ms_url = process.env.QUERY_MS_URL; //5002
const moderation_ms_url = process.env.MODERATION_MS_URL; //5003
const event_bus_ms = process.env.EVENT_BUS_MS_URL; //5005

const router = express.Router();

router.get('/comments', (req, res) => {
  let comments: Array<IComment | Partial<IComment>> = [];
  posts.map((post) => {
    return post.comments.map((comment) => comments.push(comment));
  });
  res.send(comments);
});

router.post('/comments/:postId', async (req, res, next) => {
  // let id = comments.length + 1;
  let postID = req.params.postId;
  let foundedPost = posts.find((post) => post.id == +postID);

  let { content } = req.body;
  let newComment: IComment = {
    postID,
    content,
    status: Status.PENDING,
  };

  if (!foundedPost) {
    res.send('post not founded');
    console.log('post not founded');
    next();
  } else {
    try {
      let comments = foundedPost.comments;
      newComment.id = comments.length + 1;
      comments.push(newComment);
      await fetch(`${event_bus_ms}/events`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({
          type: 'commentCreated',
          payload: newComment,
        }),
      });
      console.log('comment added event, raised to event-bus ');

      res.send(foundedPost);
    } catch (error: any) {
      console.log(error.message);
      res.send(error.message);
    }
  }
});

export default router;
