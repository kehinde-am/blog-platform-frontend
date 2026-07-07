import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { fetchPostById, updatePost } from '../api';
import Spinner from './Spinner';
import { toast } from 'react-toastify';

const EditPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await fetchPostById(postId);
        setPost({ title: data.title, content: data.content });
      } catch (error) {
        console.error('Error fetching post:', error);
        toast.error('Failed to load post');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost({ ...post, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePost(postId, post);
      toast.success('Post updated successfully!');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Failed to update post');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="page-container max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link to="/admin/dashboard" className="inline-flex items-center gap-2 text-stone-500 hover:text-brand-600 text-sm font-medium mb-8 transition-colors">
          <ArrowLeftIcon className="w-4 h-4" />
          Back to dashboard
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center">
            <PencilSquareIcon className="w-6 h-6 text-brand-600" />
          </div>
          <h1 className="section-title">Edit Post</h1>
        </div>

        <form onSubmit={handleSubmit} className="card p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Title</label>
            <input
              type="text"
              name="title"
              value={post.title}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Content</label>
            <textarea
              name="content"
              value={post.content}
              onChange={handleChange}
              className="input-field min-h-[200px] resize-y"
              required
            />
          </div>
          <button
            type="submit"
            className="btn-primary"
            data-cy="edit-button"
          >
            Update Post
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default EditPost;
