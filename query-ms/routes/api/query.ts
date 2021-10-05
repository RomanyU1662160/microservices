import express from 'express';
import { config } from 'dotenv';
import { IPost, IQuery, IComment } from '../../interfaces';
import fetch from 'node-fetch';
config();

const post_ms_url = process.env.POStS_MS_URL; //5000
const comments_ms_url = process.env.COMMENTS_MS_URL; //5001
const query_ms_url = process.env.QUERY_MS_URL; //5002
const moderation_ms_url = process.env.MODERATION_MS_URL; //5003
const event_bus_ms = process.env.EVENT_BUS_URL; //5005
const common_db_url = process.env.COMMON_DB_URL; //5006

const router = express.Router();
let queryData: Array<IQuery> = [];
const fetchQueryData = async () => {
  const res = await fetch(`${common_db_url}/query-data`);
  const data = await res.json();
  queryData = data as Array<IQuery>;
};

router.post('/newPost', async (req, res, next) => {
  await fetchQueryData();
  console.log('queryData is query-ms:::->>>', queryData);
  let { type, payload } = req.body;
  console.log('payload in the query-ms:::->>>', payload);
  let { id, title, comments } = req.body.payload;

  const newQueryData = { postId: id, title, comments };

  await fetch(`${common_db_url}/query-data`, {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(newQueryData),
  });
  console.log('queryData after updating:::->>>', queryData);
  console.log('new queryData added into the query_ms');

  next();
});

router.post('/newComment/:postId', async (req, res, next) => {
  await fetchQueryData();
  console.log('queryData:::->>>', queryData);
  let { type, payload } = req.body;
  let { postID, content, status } = payload;
  const newComment: IComment = { content, status, postID };
  console.log('newComment:::->>>', newComment);
  let foundedPost = queryData.find((post) => post.postId == +postID);
  if (foundedPost) {
    console.log('foundedPost in query-ms:::->>>', foundedPost);
    foundedPost.comments = [...foundedPost.comments, newComment];

    console.log('foundedPost.comments:::->>>', foundedPost.comments);
    await fetch(`${common_db_url}/posts/${postID}`, {
      method: 'PUT',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(foundedPost),
    });

    console.log('New Comment added to post:::->>>');
    res.send(foundedPost);
    next();
  } else {
    console.log('post not found');
    res.send('Post not Found');
    next();
  }
});

router.post('/comments/update/:postId', async (req, res, next) => {
  await fetchQueryData();
  let postId = req.params.postId;
  console.log('postId:::->>>', postId);
  let { payload } = req.body;
  console.log('payload in query-ms:::->>>', payload);

  let post = queryData.find((post) => post.postId == postId);
  if (post) {
    let foundedComment = post.comments.filter((comment) => {
      return (comment.postID = req.params.postId);
    })[0];
    if (foundedComment) {
      foundedComment = payload;
      console.log('foundedComment:::->>>', foundedComment);
      next();

      await fetch(`${common_db_url}/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(foundedComment),
      });
    } else {
      console.log('comment not founded ');
      next();
    }
  } else {
    console.log('post not founded ');
    next();
  }
});

export default router;
