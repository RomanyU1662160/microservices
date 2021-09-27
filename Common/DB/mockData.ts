import { IPost, IQuery } from '../../Common/interfaces';

export let posts: Array<IPost> = [
  { id: 1, title: 'title of post 1', comments: [] },
  { id: 2, title: 'title of post 2', comments: [] },
  { id: 3, title: 'title of post 3', comments: [] },
  { id: 4, title: 'title of post 4', comments: [] },
];

export const queryData: Array<IQuery> = [
  { postId: 1, title: 'title of post 1 ', comments: [] },
  { postId: 2, title: 'title of post 2 ', comments: [] },
  { postId: 3, title: 'title of post 3 ', comments: [] },
  { postId: 4, title: 'title of post 4 ', comments: [] },
];
