const AddCommentForm = () => {
  const handleSubmission = (e: any) => {
    e.preventDefault();
    console.log(`form submitted`);
  };

  return (
    <>
      <div className="border mb-2 p-2 bg-white">
        <form action="" onSubmit={(e) => handleSubmission(e)}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              id="content"
              placeholder="new comment..."
            />
          </div>
          <div className="form-group mt-2">
            <button className="btn btn-sm btn-outline-info float-right">
              Add comment
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddCommentForm;
