import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { fetchRecentPosts, fetchAllPosts, searchPosts } from '../api';
import Spinner from './Spinner';
import PostList from './PostList';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('recent');
  const [searchMessage, setSearchMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        let data;
        if (viewMode === 'recent') {
          data = await fetchRecentPosts();
          if (data) data = data.slice(0, 4);
        } else {
          data = await fetchAllPosts();
        }
        setPosts(data || []);
        setSearchMessage('');
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [viewMode]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      if (searchQuery.trim() !== '') {
        const results = await searchPosts(searchQuery);
        setPosts(results);
        setSearchMessage(`Posts containing "${searchQuery}"`);
      } else {
        setViewMode('recent');
      }
    } catch (error) {
      console.error('Error during search:', error);
      setSearchMessage('Error during search');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-rose-50 border-b border-stone-100">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-72 h-72 bg-brand-200 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-rose-200 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        </div>
        <div className="page-container relative text-center">
          <motion.h1
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-stone-900 mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Stories worth{' '}
            <span className="gradient-text">reading</span>
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-stone-500 max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            Discover insightful articles, fresh perspectives, and ideas that inspire.
          </motion.p>

          <motion.div
            className="max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="flex gap-2 p-1.5 bg-white rounded-2xl shadow-soft border border-stone-100">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => { if (e.key === 'Enter') handleSearch(); }}
                  placeholder="Search posts..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-transparent text-stone-900 placeholder:text-stone-400 focus:outline-none"
                />
              </div>
              <button onClick={handleSearch} className="btn-primary !rounded-xl shrink-0">
                Search
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Posts section */}
      <section className="page-container">
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 bg-stone-100 rounded-2xl">
            {['recent', 'all'].map((mode) => (
              <button
                key={mode}
                className={`relative px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 ${
                  viewMode === mode ? 'text-white' : 'text-stone-500 hover:text-stone-700'
                }`}
                onClick={() => setViewMode(mode)}
              >
                {viewMode === mode && (
                  <motion.div
                    layoutId="viewToggle"
                    className="absolute inset-0 bg-brand-600 rounded-xl shadow-sm"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">
                  {mode === 'recent' ? 'Recent Posts' : 'All Posts'}
                </span>
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {searchMessage && (
            <motion.p
              key="search-msg"
              className="text-center text-stone-500 mb-6 font-medium"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {searchMessage}
            </motion.p>
          )}
        </AnimatePresence>

        <PostList posts={posts} />
      </section>
    </div>
  );
};

export default Home;
