import express from 'express';
import { checkIfExist } from '../../middlewares/checkifExist';
import { posts } from '../../../Common/DB/mockData';
import fetch from 'node-fetch';
import { IPost } from '../../../Common/interfaces';
import { config } from 'dotenv';

config();

const router = express.Router();

const post_ms_url = process.env.POStS_MS_URL; //5000
const comments_ms_url = process.env.COMMENTS_MS_URL; //5001
const query_ms_url = process.env.QUERY_MS_URL; //5002
const moderation_ms_url = process.env.MODERATION_MS_URL; //5003
const event_bus_ms = process.env.EVENT_BUS_MS_URL; //5005

router.get('/posts', (req, res) => {
  console.log('posts :::->>>', posts);
  res.status(200).send(posts);
});

router.post('/posts', async (req, res, next) => {
  const { title } = req.body;
  const newPost: IPost = { id: posts.length + 1, title, comments: [] };
  posts.push(newPost);

  await fetch(`${event_bus_ms}/events`, {
    method: 'POST',
    body: JSON.stringify({ type: 'postCreated', payload: newPost }),
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
  });

  res.send(posts).status(200);
  next();
});

router.post('/:postId/comments/new', async (req, res, next) => {
  const { payload } = req.body;
  let postId = req.params.postId;

  let foundedPost = posts.find((post) => post.id == +postId);

  if (foundedPost) {
    console.log('foundedPost:::->>>', foundedPost);
    foundedPost.comments.push(payload);
    console.log('post comments updated n post-ms ');
    res.send(foundedPost);
    next();
  } else {
    console.log('post not founded ');
  }
});

router.post('/:postId/comments/update/:commentId', (req, res, next) => {
  let { postId, commentId } = req.params;
  let { payload } = req.body;

  let foundedPost = posts.find((post) => post.id == +postId);
  if (!foundedPost) {
    console.log('post not found');
    res.send('post not found');
    next();
  } else {
    foundedPost.comments.map((comment) => {
      if (comment.id == +commentId) {
        console.log('comment.id equal commentID');
        comment.status = payload.status;

        return comment;
      } else {
        console.log('comment not found ');
      }
    });

    res.send(foundedPost);
  }
});
export default router;
