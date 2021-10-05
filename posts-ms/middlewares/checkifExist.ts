import { fetchPosts, IPost } from './../routes/apis/posts';
import { RequestHandler } from 'express';

let posts: Array<IPost> = [];
export const checkIfExist: RequestHandler = async (req, res, next) => {
  const { title } = req.body;

  await fetchPosts();
  let filtered = posts.filter((P) => P.title === title);
  console.log('filtered:::->>>', filtered);
  if (filtered.length > 0) {
    return res.send('Post already exist');
  }
  next();
};
