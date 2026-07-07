import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatBubbleLeftRightIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { fetchComments, deleteComment, editComment, addComment } from '../api';
import { useAuth } from '../context/AuthContext';

const CommentsSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editText, setEditText] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const loadComments = async () => {
      try {
        setLoading(true);
        const fetchedComments = await fetchComments(postId);
        setComments(fetchedComments);
      } catch (error) {
        console.error('Error fetching comments:', error);
        setErrorMessage('Failed to fetch comments.');
      } finally {
        setLoading(false);
      }
    };
    loadComments();
  }, [postId, user]);

  const handleNewCommentSubmit = async (event) => {
    event.preventDefault();
    if (newCommentText.trim()) {
      try {
        const newComment = await addComment(postId, { comment: newCommentText, user_id: user?.id });
        setComments((prev) => [...prev, { ...newComment, user_name: user?.name }]);
        setNewCommentText('');
      } catch (error) {
        console.error('Error adding new comment:', error);
        setErrorMessage('Failed to submit comment.');
      }
    }
  };

  const handleEdit = (comment) => {
    setEditCommentId(comment.id);
    setEditText(comment.comment);
  };

  const handleDelete = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
      setErrorMessage('Failed to delete comment.');
    }
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    if (!editText.trim()) return;
    try {
      const updatedComment = await editComment(editCommentId, { comment: editText });
      setComments(comments.map((c) =>
        c.id === editCommentId ? { ...c, ...updatedComment } : c
      ));
      setEditCommentId(null);
    } catch (error) {
      console.error('Error editing comment:', error);
      setErrorMessage('Failed to edit comment.');
    }
  };

  if (loading) {
    return (
      <div className="mt-10 space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="skeleton h-20" />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-10">
      <div className="flex items-center gap-2 mb-6">
        <ChatBubbleLeftRightIcon className="w-6 h-6 text-brand-600" />
        <h3 className="font-display text-2xl font-bold text-stone-900">
          Comments
          <span className="ml-2 text-sm font-sans font-medium text-stone-400">
            ({comments.length})
          </span>
        </h3>
      </div>

      {errorMessage && (
        <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
      )}

      {user && (
        <motion.form
          onSubmit={handleNewCommentSubmit}
          className="card p-5 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <textarea
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Share your thoughts..."
            className="input-field min-h-[100px] resize-y mb-3"
          />
          <button type="submit" className="btn-primary text-sm">
            Post comment
          </button>
        </motion.form>
      )}

      {!user && (
        <p className="text-stone-400 text-sm mb-6 italic">
          Sign in to join the conversation.
        </p>
      )}

      <ul className="space-y-4">
        <AnimatePresence>
          {comments.map((comment, index) => (
            <motion.li
              key={comment.id}
              className="card p-5"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              {editCommentId === comment.id ? (
                <form onSubmit={handleEditSubmit}>
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="input-field min-h-[80px] resize-y mb-3"
                  />
                  <div className="flex gap-2">
                    <button type="submit" className="btn-primary text-sm">Save</button>
                    <button type="button" onClick={() => setEditCommentId(null)} className="btn-secondary text-sm">
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold">
                      {(comment.user_name || 'A')[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-stone-700">
                      {comment.user_name || 'Anonymous'}
                    </span>
                  </div>
                  <p className="whitespace-pre-line text-stone-600 leading-relaxed pl-10">
                    {comment.comment}
                  </p>
                  {user && user.id === comment.user_id && (
                    <div className="flex gap-2 mt-3 pl-10">
                      <button
                        onClick={() => handleEdit(comment)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-stone-500 hover:text-brand-600 transition-colors"
                      >
                        <PencilIcon className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-stone-500 hover:text-red-600 transition-colors"
                      >
                        <TrashIcon className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {comments.length === 0 && (
        <p className="text-center text-stone-400 py-8">
          No comments yet. Be the first to share your thoughts!
        </p>
      )}
    </div>
  );
};

export default CommentsSection;
