import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { fetchAllPosts } from '../api';
import Spinner from './Spinner';
import PostList from './PostList';

const Profile = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const postsData = await fetchAllPosts();
          setPosts(postsData);
        } catch (error) {
          console.error('Error fetching posts:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [user]);

  if (!user || loading) return <Spinner />;

  const initials = user.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <div className="page-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="card p-8 mb-10 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center text-white text-xl font-bold shadow-glow shrink-0">
            {initials}
          </div>
          <div>
            <p className="text-sm text-stone-500 font-medium">Welcome back</p>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-stone-900">
              {user.name}
            </h1>
            <p className="text-stone-400 text-sm mt-0.5">{user.email}</p>
          </div>
        </div>

        <h2 className="section-title mb-6">Browse Posts</h2>
        <PostList posts={posts} />
      </motion.div>
    </div>
  );
};

export default Profile;
