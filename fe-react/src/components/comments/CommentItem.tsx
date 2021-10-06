import { IComment } from '../../interfaces/interfaces';

type CommentItemProps = {
  comment: Partial<IComment>;
};

const CommentItem = ({ comment }: CommentItemProps) => {
  return (
    <>
      <h5 className="bg-info p-1"> {comment.content} </h5>
    </>
  );
};

export default CommentItem;
