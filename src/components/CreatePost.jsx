import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { createPost } from '../api';
import { toast } from 'react-toastify';
import { DocumentPlusIcon } from '@heroicons/react/24/outline';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title || !content) {
      toast.error('Title and content are required');
      return;
    }
    try {
      await createPost({ title, content });
      setTitle('');
      setContent('');
      toast.success('Post created successfully!');
    } catch (error) {
      console.error('Failed to create the post', error);
      toast.error('Failed to create the post');
    }
  };

  return (
    <div className="page-container max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center">
            <DocumentPlusIcon className="w-6 h-6 text-brand-600" />
          </div>
          <div>
            <h1 className="section-title">Create a New Post</h1>
            <p className="text-stone-500 text-sm">Share your story with the world</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card p-8 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-stone-700 mb-1.5">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              placeholder="Give your post a compelling title"
              required
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-stone-700 mb-1.5">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="input-field min-h-[200px] resize-y"
              placeholder="Write your post content here..."
              rows="6"
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Publish Post
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreatePost;
