export interface IPost {
  id: string;
  title: string;
  comments?: Partial<IComment>[];
}

export interface IComment {
  id?: string | number;
  postID: string;
  content: string;
  status: Status;
}

export interface IQuery {
  postId: string | number;
  commentsId: Array<string>;
}

export enum Status {
  APPROVED = 'approved',
  PENDING = 'pending',
  REJECTED = 'rejected',
}
