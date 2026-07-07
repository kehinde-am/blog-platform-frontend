import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import Modal from 'react-modal';
import {
  UsersIcon,
  DocumentTextIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';
import { fetchUsers, fetchAllPosts, deleteUser, deletePost } from '../api';
import Spinner from './Spinner';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState({ type: '', id: null });

  useEffect(() => {
    if (document.getElementById('root')) {
      Modal.setAppElement('#root');
    }

    const loadData = async () => {
      try {
        const [usersData, postsData] = await Promise.all([
          fetchUsers(),
          fetchAllPosts(),
        ]);
        setUsers(usersData);
        setPosts(postsData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleDeleteConfirmation = (type, id) => {
    setCurrentItem({ type, id });
    setModalIsOpen(true);
  };

  const closeModal = () => setModalIsOpen(false);

  const handleDelete = async () => {
    try {
      if (currentItem.type === 'user') {
        await deleteUser(currentItem.id);
        setUsers(users.filter((u) => u.id !== currentItem.id));
      } else if (currentItem.type === 'post') {
        await deletePost(currentItem.id);
        setPosts(posts.filter((p) => p.id !== currentItem.id));
      }
      closeModal();
    } catch (error) {
      console.error(`Error deleting ${currentItem.type}:`, error);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="page-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="section-title">Admin Dashboard</h1>
            <p className="text-stone-500 mt-1">Manage users and content</p>
          </div>
          <NavLink to="/createpost" className="btn-primary">
            <PlusIcon className="w-5 h-5" />
            Create Post
          </NavLink>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          <motion.div
            className="card p-6 flex items-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center">
              <UsersIcon className="w-6 h-6 text-brand-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-stone-900">{users.length}</p>
              <p className="text-sm text-stone-500">Total Users</p>
            </div>
          </motion.div>
          <motion.div
            className="card p-6 flex items-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center">
              <DocumentTextIcon className="w-6 h-6 text-violet-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-stone-900">{posts.length}</p>
              <p className="text-sm text-stone-500">Total Posts</p>
            </div>
          </motion.div>
        </div>

        <section className="mb-10">
          <h2 className="font-display text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
            <UsersIcon className="w-5 h-5 text-brand-600" />
            Users
          </h2>
          <div className="card overflow-hidden">
            {users.length === 0 ? (
              <p className="p-6 text-stone-400 text-center">No users found</p>
            ) : (
              <ul className="divide-y divide-stone-100">
                {users.map((user, i) => (
                  <motion.li
                    key={user.id}
                    className="flex justify-between items-center p-5 hover:bg-stone-50/50 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <div>
                      <p className="font-semibold text-stone-900">{user.name}</p>
                      <p className="text-sm text-stone-500">{user.email}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteConfirmation('user', user.id)}
                      className="btn-danger text-sm !py-2 !px-3"
                    >
                      <TrashIcon className="w-4 h-4" />
                      Delete
                    </button>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
            <DocumentTextIcon className="w-5 h-5 text-brand-600" />
            Posts
          </h2>
          <div className="card overflow-hidden">
            {posts.length === 0 ? (
              <p className="p-6 text-stone-400 text-center">No posts found</p>
            ) : (
              <ul className="divide-y divide-stone-100">
                {posts.map((post, i) => (
                  <motion.li
                    key={post.id}
                    className="flex justify-between items-center p-5 hover:bg-stone-50/50 transition-colors gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <p className="font-semibold text-stone-900 truncate">{post.title}</p>
                    <div className="flex gap-2 shrink-0">
                      <NavLink
                        to={`/edit-post/${post.id}`}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                        data-cy={`edit-post-${post.id}`}
                      >
                        <PencilIcon className="w-4 h-4" />
                        Edit
                      </NavLink>
                      <button
                        onClick={() => handleDeleteConfirmation('post', post.id)}
                        className="btn-danger text-sm !py-2 !px-3"
                      >
                        <TrashIcon className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          className="m-auto bg-white rounded-2xl p-6 max-w-md w-full outline-none shadow-card-hover border border-stone-100"
          overlayClassName="fixed inset-0 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <h2 className="font-display text-xl font-bold text-stone-900 mb-2">Confirm Deletion</h2>
          <p className="text-stone-500 mb-6">
            Are you sure you want to delete this {currentItem.type}? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button onClick={closeModal} className="btn-secondary text-sm">Cancel</button>
            <button onClick={handleDelete} className="btn-danger text-sm">Yes, Delete</button>
          </div>
        </Modal>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
