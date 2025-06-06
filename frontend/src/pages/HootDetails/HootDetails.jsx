import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router';
import CommentForm from '../../components/CommentForm/CommentForm';
import * as hootService from '../../services/hootService';

export default function HootDetails() {
  console.log('HootDetailPage rendering');
  const [hoot, setHoot] = useState(null);
  const params = useParams();
  const { hootId } = params;



  const handleAddComment = async (commentFormData) => {
      const newComment = await hootService.createComment(hootId, commentFormData);
      setHoot({ ...hoot, comments: [...hoot.comments, newComment] });
    };

  useEffect(() => {
    console.log('useEffect running with hootId:', hootId);
    
    async function fetchHoot() {
      console.log('fetchHoot function called');
      try {
        const hootData = await hootService.show(hootId);
        setHoot(hootData);
      } catch (error) {
        console.error('Error fetching hoot:', error);
      }
    }
    
    fetchHoot();
  }, [hootId]);

  console.log('Current hoot state:', hoot);
  
  if (!hoot) {
    console.log('Rendering loading state');
    return <div>Loading...</div>;
  }

  console.log('Rendering hoot details');


  return (
    <main>
      <section>
          <header>
            <p>{hoot.category.toUpperCase()}</p>
            <h1>{hoot.title}</h1>
            <p>
              {`${hoot.author.username} posted on
              ${new Date(hoot.createdAt).toLocaleDateString()}`}
            </p>
            {/* Add the following */}
            {hoot.author._id === user._id && (
              <>
                <button>Delete</button>
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
