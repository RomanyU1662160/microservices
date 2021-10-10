import { IComment } from '../../interfaces/interfaces';
import CommentItem from './CommentItem';

type CommentsListProps = {
  comments: IComment[] | Partial<IComment>[];
};

const CommentsList = (props: CommentsListProps) => {
  const { comments } = props;
  return (
    <>
      {comments.map((comment) => (
        <CommentItem comment={comment} key={comment.id} />
      ))}
    </>
  );
};

export default CommentsList;
