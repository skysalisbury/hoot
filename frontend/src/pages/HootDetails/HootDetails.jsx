import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router';
import CommentForm from '../../components/CommentForm/CommentForm';
import * as hootService from '../../services/hootService';

export default function HootDetails(props) {
  const [hoot, setHoot] = useState(null);
  const params = useParams();
  const { hootId } = params;

  const handleAddComment = async (commentFormData) => {
    const newComment = await hootService.createComment(hootId, commentFormData);
    setHoot({ ...hoot, comments: [...hoot.comments, newComment] });
  };

  const handleDeleteComment = async (commentId) => {
  try {
    await hootService.deleteComment(hootId, commentId);
    setHoot({
      ...hoot,
      comments: hoot.comments.filter((comment) => comment._id !== commentId),
    });
  } catch (err) {
    console.error('Error deleting comment:', err);
  }
};


  useEffect(() => {
    async function fetchHoot() {
      const hootData = await hootService.show(hootId);
      setHoot(hootData);
    }
    fetchHoot();
  }, [hootId]);
  console.log('hoot state:', hoot);

  if (!hoot) return <main>Loading...</main>;
  return (
    <main>
      <section>
        <header>
          <p>{hoot.category.toUpperCase()}</p>
          <h1>{hoot.title}</h1>
          <p>
            {`${hoot.author.name} posted on
              ${new Date(hoot.createdAt).toLocaleDateString()}`}
          </p>
        </header>
        <p>{hoot.text}</p>
          {hoot.author._id === props.user._id && (
            <>
              <Link to={`/hoots/${hootId}/edit`}>Edit</Link>

              <button onClick={() => props.handleDeleteHoot(hootId)}>
                Delete
              </button>
            </>
          )}
      </section>
      <section>
        <h2>Comments</h2>
        <CommentForm handleAddComment={handleAddComment} handleDeleteComment={handleDeleteComment} />

        {!hoot.comments.length && <p>There are no comments.</p>}

        {hoot.comments.map((comment) => (
          <article key={comment._id}>
            <header>
              <p>
                {`${comment.author.name} posted on
                ${new Date(comment.createdAt).toLocaleDateString()}`}
              </p>
            </header>
            <p>{comment.text}</p>
                {hoot.author._id === props.user._id && (
                  <>
                    <Link to={`/hoots/${hootId}/comments/${comment._id}/edit`}>Edit</Link>
        
                    <button onClick={() => handleDeleteComment(comment._id)}>
                      Delete
                    </button>
                  </>
                )}
          </article>
        ))}
      </section>
    </main>
  );
}
