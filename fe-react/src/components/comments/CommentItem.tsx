import { IComment } from '../../interfaces/interfaces';

type CommentItemProps = {
  comment: Partial<IComment>;
};

const CommentItem = ({ comment }: CommentItemProps) => {
  return (
    <>
      <div className="row bg-info p-1 m-1 rounded-3">
        <div className="col-md-9">
          <h5 className="bg-info p-1">{comment.content} </h5>{' '}
        </div>
        <div className="col-md-3">
          <span
            className={`badge ${
              comment.status === 'approved' ? 'bg-success' : 'bg-danger'
            } `}
          >
            {comment.status}
          </span>
        </div>
      </div>
    </>
  );
};

export default CommentItem;
