import express from 'express';
import { config } from 'dotenv';
import fetch from 'node-fetch';
import { IComment, Status, IPost } from '../../interfaces/interfaces';

config();

const post_ms_url = process.env.POStS_MS_URL; //5000
const comments_ms_url = process.env.COMMENTS_MS_URL; //5001
const query_ms_url = process.env.QUERY_MS_URL; //5002
const moderation_ms_url = process.env.MODERATION_MS_URL; //5003
const event_bus_ms = process.env.EVENT_BUS_MS_URL; //5005
const common_db_url = process.env.COMMON_DB_URL; //5006

const router = express.Router();

let posts: Array<IPost> = [];
export const fetchPosts = async (): Promise<IPost[]> => {
  try {
    const res = await fetch(`${common_db_url}/posts`);
    const data = await res.json();
    posts = data;
    return posts;
  } catch (error) {
    console.log('error:::->>>', error);
    return posts;
  }
};

router.get('/comments', async (req, res) => {
  await fetchPosts();
  let comments: Array<IComment | Partial<IComment>> = [];
  posts.map((post) => {
    return post.comments!.map((comment) => comments.push(comment));
  });
  res.send(comments);
});

router.post('/comments/:postId', async (req, res, next) => {
  await fetchPosts();

  let postID = req.params.postId;
  const { content } = req.body;
  let newComment: IComment = {
    postID,
    content,
    status: Status.PENDING,
  };

  let foundedPost = posts.find((post) => post.id == postID);

  if (foundedPost) {
    console.log('foundedPost:::->>>', foundedPost);
    foundedPost.comments = [
      ...foundedPost.comments,
      newComment as Partial<IComment>,
    ];

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
  next();
});

export default router;
