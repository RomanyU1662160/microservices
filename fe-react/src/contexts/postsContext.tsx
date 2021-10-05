import { createContext, ReactNode, useEffect, useState } from 'react';
import { config } from 'dotenv';
import { IPost } from '../interfaces/interfaces';

config();

export const PostsContext = createContext({});

const postsURL = 'http://localhost:32309/api/posts';
console.log(`postsURL`, postsURL);

interface Props {
  children: ReactNode;
}

const PostsProvider = ({ children }: Props) => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [isError, setIsError] = useState<Error>();

  const fetchPosts = async () => {
    if (postsURL) {
      try {
        const res = await fetch(postsURL);
        const data = await res.json();
        setPosts(data);
        console.log(`data::>>>`, data);
      } catch (error) {
        console.log(`error`, error);
        setIsError(error as Error);
      }
    } else {
      console.log('post url is not defined.');
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
      {isError && (
        <h3 className="text-warning text-center"> {isError.message} </h3>
      )}

      {children}
    </PostsContext.Provider>
  );
};

export default PostsProvider;
