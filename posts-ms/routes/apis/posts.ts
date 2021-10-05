import express from 'express';
import { checkIfExist } from '../../middlewares/checkifExist';
import fetch from 'node-fetch';

import { config } from 'dotenv';

config();

export interface IPost {
  id: number;
  title: string;
  comments: Partial<IComment>[];
}

export enum Status {
  APPROVED = 'approved',
  PENDING = 'pending',
  REJECTED = 'rejected',
}

export interface IComment {
  id?: string | number;
  postID: string;
  content: string;
  status: Status;
}

const router = express.Router();

const post_ms_url = process.env.POStS_MS_URL; //5000
const comments_ms_url = process.env.COMMENTS_MS_URL; //5001
const query_ms_url = process.env.QUERY_MS_URL; //5002
const moderation_ms_url = process.env.MODERATION_MS_URL; //5003
const event_bus_ms = process.env.EVENT_BUS_MS_URL; //5005
const common_db_url = process.env.COMMON_DB_URL; //5006

let posts: Array<IPost> = [];
export const fetchPosts = async () => {
  try {
    const res = await fetch(`${common_db_url}/posts`);
    const data = await res.json();
    console.log('data from json-server:::->>>', data);
    posts = data;
  } catch (error) {
    console.log('error:::->>>', error);
  }
};

router.get('/posts', async (req, res) => {
  await fetchPosts();
  console.log('posts from json server :::->>>', posts);
  res.status(200).send(posts);
});

router.post('/posts', async (req, res, next) => {
  const { title } = req.body;
  const newPost: IPost = { id: posts.length + 1, title, comments: [] };
  try {
    await fetch(`${common_db_url}/posts`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(newPost),
    });

    await fetch(`${event_bus_ms}/events`, {
      method: 'POST',
      body: JSON.stringify({ type: 'postCreated', payload: newPost }),
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
    });

    await fetchPosts();
    res.send(posts).status(200);
    next();
  } catch (error) {
    res.send(error);
    console.log('error:::->>>', error);
  }
});

router.post('/:postId/comments/new', async (req, res, next) => {
  await fetchPosts();
  const { content, status } = req.body;
  const newComment = { content, status };
  console.log('payload:::->>>', newComment);
  let postId = req.params.postId;

  let foundedPost = posts.find((post) => post.id == +postId);

  if (foundedPost) {
    console.log('foundedPost:::->>>', foundedPost);
    foundedPost.comments = [
      ...foundedPost.comments,
      { newComment } as Partial<IComment>,
    ];

    console.log('updatedComments:::->>>', foundedPost.comments);
    await fetch(`${common_db_url}/posts/${foundedPost.id}`, {
      method: 'PUT',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(foundedPost),
    });
    res.send(foundedPost);
    next();
  } else {
    console.log('post not founded ');
    res.send('Post not found ');
    next();
  }
});

router.post('/:postId/comments/update/:commentId', async (req, res, next) => {
  await fetchPosts();
  let { postId, commentId } = req.params;
  let { payload } = req.body;

  let foundedPost = posts.find((post) => post.id == +postId);
  if (!foundedPost) {
    console.log('post not found');
    res.send('post not found');
    next();
  } else {
    foundedPost.comments.map((comment: Partial<IComment>) => {
      if (comment.id == +commentId) {
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
