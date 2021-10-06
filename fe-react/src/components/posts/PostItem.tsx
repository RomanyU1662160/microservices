import React from 'react';
import { IPost } from '../../interfaces/interfaces';

type PostItemProps = {
  post: IPost;
  handleSelectPost: (post: IPost) => void;
  isActive: boolean;
};

const PostItem = ({ post, handleSelectPost, isActive }: PostItemProps) => {
  return (
    <>
      <div
        className={`card col-md-3 m-2 ${isActive ? 'bg-info' : ''}`}
        onClick={() => handleSelectPost(post)}
      >
        <div className="card-title"> {post.title}</div>
      </div>
    </>
  );
};
export default PostItem;
