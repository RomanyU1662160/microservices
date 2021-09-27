import { RequestHandler } from 'express';
import { posts } from '../../Common/DB/mockData';

export const checkIfExist: RequestHandler = (req, res, next) => {
  const { title } = req.body;
  console.log('title', title);

  let filtered = posts.filter((P) => P.title === title);
  console.log('filtered:::->>>', filtered);
  if (filtered.length > 0) {
    return res.send('Post already exist');
  }
  next();
};
