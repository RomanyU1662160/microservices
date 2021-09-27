export interface IPost {
  id: string;
  title: string;
  comments?: Partial<IComment>[];
}

export interface IComment {
  id?: string;
  postID: string;
  content: string;
  status: Status;
}

export interface IQuery {
  postId: string | number;
  postTitle: string;
  comments: IComment[];
}

export enum Status {
  APPROVED = 'approved',
  PENDING = 'pending',
  REJECTED = 'rejected',
}
