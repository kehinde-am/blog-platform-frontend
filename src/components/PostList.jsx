import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChatBubbleLeftIcon, CalendarIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const PostList = ({ posts, loading }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const truncate = (text, max = 160) => {
    if (!text || text.length <= max) return text;
    return text.slice(0, max).trim() + '...';
  };

  if (loading) {
    return <p className="text-center text-stone-500">Loading...</p>;
  }

  if (!posts || posts.length === 0) {
    return (
      <motion.div
        className="text-center py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-brand-50 flex items-center justify-center">
          <ChatBubbleLeftIcon className="w-8 h-8 text-brand-400" />
        </div>
        <p className="text-stone-500 text-lg font-medium">No posts found</p>
        <p className="text-stone-400 text-sm mt-1">Check back soon for new stories.</p>
      </motion.div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const item = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  return (
    <motion.div
      className="grid gap-6 md:grid-cols-2"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {posts.map((post, index) => (
        <motion.article
          key={post.id}
          variants={item}
          className="card-hover group overflow-hidden"
        >
          <div className="p-6 md:p-7">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">
                <CalendarIcon className="w-3.5 h-3.5" />
                {formatDate(post.created_at)}
              </span>
              {index === 0 && (
                <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
                  Latest
                </span>
              )}
            </div>

            <h2 className="font-display text-xl md:text-2xl font-bold text-stone-900 mb-3 group-hover:text-brand-700 transition-colors">
              <Link to={`/posts/${post.id}`}>{post.title}</Link>
            </h2>

            <p className="text-stone-500 leading-relaxed mb-5">
              {truncate(post.content)}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-stone-100">
              <Link
                to={`/posts/${post.id}`}
                className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-brand-600 transition-colors"
              >
                <ChatBubbleLeftIcon className="w-4 h-4" />
                {post.commentCount ? `${post.commentCount} Comments` : 'No comments yet'}
              </Link>
              <Link
                to={`/posts/${post.id}`}
                className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0"
              >
                Read more
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.article>
      ))}
    </motion.div>
  );
};

export default PostList;
