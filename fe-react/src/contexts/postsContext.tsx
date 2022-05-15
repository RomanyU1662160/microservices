import { createContext, ReactNode, useEffect, useState } from 'react';
import { config } from 'dotenv';
import { IPost } from '../interfaces/interfaces';

config();

export const PostsContext = createContext<IPost[]>([]);

// const postsURL = 'http://romany-app.com/api/posts';
const postsURL =  process.env.REACT_APP_POSTS_MS_URL  ;
console.log(`postsURL:::>>>>`, postsURL);

interface Props {
  children: ReactNode;
}

const PostsProvider = ({ children }: Props) => {
  const examplePost:IPost = {  title:"Test-number 2", "comments": [
    {
      "content": "Some Content",
      "status": undefined,
      "postID": "1"
    }
  ],id:0} 
  const [posts, setPosts] = useState<IPost[]>([examplePost]);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [isError, setIsError] = useState<Error>();
  const [hasError, setHasError] = useState<Boolean>(false);

  const fetchPosts = async () => {
    if (postsURL) {
      try {
        const res = await fetch(postsURL);
        const data = await res.json();
        console.log(`data`, data);
        setPosts(data as IPost[]);
        setHasError(false);
      } catch (error) {
        console.log(`error`, error);
        setIsError(error as Error);
        setHasError(true);
      }
    } else {
      console.log('post url is not defined.');
      setHasError(true)
      setIsError(new Error("post url is not defined."))
    }
  };

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      fetchPosts();
      setIsLoading(false);
    }, 3000);
  }, []);

  return (
    <PostsContext.Provider value={posts}>
      {isLoading && '...Loading '}
      {hasError && isError && (
        <h3 className="text-warning text-center"> {isError.message} </h3>
      )}

      {children}
    </PostsContext.Provider>
  );
};

export default PostsProvider;
