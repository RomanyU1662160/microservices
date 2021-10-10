import { IComment } from '../../interfaces/interfaces';
import AddCommentForm from '../comments/AddCommentForm';
import CommentsList from '../comments/CommentsList';

type CommentsPageProps = {
  comments: IComment[] | Partial<IComment>[];
};

const CommentsPage = (props: CommentsPageProps) => {
  const { comments } = props;
  return (
    <>
      <div className="m-3">
        <AddCommentForm />
      </div>
      <h3 className="text-center text-warning"> Comments</h3>
      <CommentsList comments={comments} />
    </>
  );
};

export default CommentsPage;
