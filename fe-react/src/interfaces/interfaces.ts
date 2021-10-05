export interface IPost {
  id: number;
  title: string;
  comments: Partial<IComment>[];
}

export interface IComment {
  id?: string | number;
  postID: string;
  content: string;
  status?: Status;
}

export interface IQuery {
  postId: string | number;
  title: string;
  comments: IComment[];
}

export enum Status {
  APPROVED = 'approved',
  PENDING = 'pending',
  REJECTED = 'rejected',
}
