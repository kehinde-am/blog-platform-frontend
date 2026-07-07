import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { fetchPostById } from '../api';
import Spinner from './Spinner';
import CommentsSection from './CommentsSection';

const PostDetail = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const { postId } = useParams();

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

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <Spinner />;

  if (!post) {
    return (
      <div className="page-container text-center py-20">
        <p className="text-red-500 text-lg">{errorMessage || 'Post not found.'}</p>
        <Link to="/" className="btn-secondary mt-6 inline-flex">
          <ArrowLeftIcon className="w-4 h-4" /> Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link to="/" className="inline-flex items-center gap-2 text-stone-500 hover:text-brand-600 text-sm font-medium mb-8 transition-colors">
          <ArrowLeftIcon className="w-4 h-4" />
          Back to all posts
        </Link>

        <article className="card overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-brand-500 via-violet-500 to-rose-500" />
          <div className="p-8 md:p-10">
            <div className="flex items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 text-sm text-stone-500">
                <CalendarIcon className="w-4 h-4" />
                {formatDate(post.created_at)}
              </span>
            </div>

            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-stone-900 leading-tight mb-6">
              {post.title}
            </h1>

            <div className="prose prose-stone max-w-none">
              <p className="text-stone-600 text-lg leading-relaxed whitespace-pre-line">
                {post.content}
              </p>
            </div>

            {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
          </div>
        </article>

        <CommentsSection postId={postId} />
      </motion.div>
    </div>
  );
};

export default PostDetail;
