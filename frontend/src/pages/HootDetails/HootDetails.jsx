import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router';
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
          {hoot.author._id === props.user._id && (
            <>
              <button onClick={() => props.handleDeleteHoot(hootId)}>Delete</button>
            </>
          )}
        </header>
        <p>{hoot.text}</p>
      </section>
      <section>
        <h2>Comments</h2>
        <CommentForm handleAddComment={handleAddComment} />

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
          </article>
        ))}
      </section>
    </main>
  );
}
