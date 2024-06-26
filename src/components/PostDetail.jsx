// Code for the PostDetail component goes here.
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPostById } from '../api';
import Spinner from './Spinner';
import CommentsSection from './CommentsSection'; 

const PostDetail = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const { postId } = useParams();

// Fetch the post data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const postData = await fetchPostById(postId);
        setPost(postData);
      } catch (error) {
        console.error('Error fetching post:', error);
        setErrorMessage('Failed to fetch post details.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [postId]);

  if (loading) {
    return <Spinner />;
  }

  if (!post) {
    // Display error message or alternative content if post is not available
    return <p className="text-center text-red-500">{errorMessage || 'Post not found.'}</p>;
  }
// Render the post details and comments section
  return (
    <div className="container mx-auto mt-10 p-5">
      <article className="max-w-xl mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="md:flex">
          <div className="p-8">
            <h2 className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{post.title}</h2>
            <p className="mt-2 text-gray-500">{post.content}</p>
            {/* Error message is shown only if there's an error and no post */}
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            {/* Render the CommentsSection only if the post is available */}
            <CommentsSection postId={postId} />
          </div>
        </div>
      </article>
    </div>
  );
};

export default PostDetail;
