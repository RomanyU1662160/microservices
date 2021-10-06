import { useContext, useState } from 'react';
import { PostsContext } from '../../contexts/postsContext';
import { IPost } from '../../interfaces/interfaces';
import CommentItem from '../comments/CommentItem';
import PostItem from './PostItem';

const PostsList = () => {
  const posts = useContext(PostsContext);
  const [activePost, setActivePost] = useState<IPost>();
  console.log(`posts in page`, posts);

  const handleSelectPost = (post: IPost) => {
    setActivePost(post);
  };
  return (
    <>
      <div className="row">
        <div className="col-md-8 ">
          <div className="row">
            {posts.map((post) => (
              <PostItem
                post={post}
                handleSelectPost={handleSelectPost}
                isActive={post.id === activePost?.id}
                key={post.id}
              />
            ))}
          </div>
        </div>
        <div className="col-md-4 bg-light">
          Comments
          {activePost &&
            activePost.comments.map((comment) => (
              <CommentItem comment={comment} key={comment.id} />
            ))}
        </div>
      </div>
    </>
  );
};

export default PostsList;
