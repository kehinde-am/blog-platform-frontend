import React from 'react';
import { BrowserRouter as Router, MemoryRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Profile from './components/Profile';
import Register from './components/Register';
import CreatePost from './components/CreatePost';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import AdminDashboard from './components/AdminDashboard';
import NavBar from './components/NavBar';
import ProtectedRoute from './components/ProtectedRoute';
import EditPost from './components/EditPost';
import { ToastContainer } from 'react-toastify';

const AppRouter = process.env.NODE_ENV === 'test' ? MemoryRouter : Router;

function App() {
  return (
    <AppRouter>
      <div className="min-h-screen bg-surface flex flex-col">
        <ToastContainer
          position="top-center"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="light"
        />
        <NavBar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={
              <ProtectedRoute><Profile /></ProtectedRoute>
            } />
            <Route path="/posts" element={<PostList />} />
            <Route path="/posts/:postId" element={<PostDetail />} />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="/createpost" element={
              <ProtectedRoute adminOnly={true}><CreatePost /></ProtectedRoute>
            } />
            <Route path="/edit-post/:postId" element={
              <ProtectedRoute adminOnly={true}><EditPost /></ProtectedRoute>
            } />
          </Routes>
        </main>
        <footer className="border-t border-stone-100 bg-white py-8 mt-auto">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p className="font-display text-lg font-bold gradient-text mb-1">Verse</p>
            <p className="text-stone-400 text-sm">Stories worth reading.</p>
          </div>
        </footer>
      </div>
    </AppRouter>
  );
}

export default App;
