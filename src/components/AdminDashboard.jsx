import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import Modal from 'react-modal';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState({ type: '', id: null });

    useEffect(() => {
        if (document.getElementById('root')) {
            Modal.setAppElement('#root');
        }

        const fetchUsers = async () => {
            try {
                const response = await axios.get('https://mi-linux.wlv.ac.uk/~2315822/blog-platform-backend/public/api/users');
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        const fetchPosts = async () => {
            try {
                const response = await axios.get('https://mi-linux.wlv.ac.uk/~2315822/blog-platform-backend/public/api/posts');
                setPosts(response.data);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        fetchUsers();
        fetchPosts();
    }, []);

    const handleDeleteConfirmation = (type, id) => {
        setCurrentItem({ type, id });
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleDelete = async () => {
        const url = `https://mi-linux.wlv.ac.uk/~2315822/blog-platform-backend/public/api/${currentItem.type}s/${currentItem.id}`;
        try {
            await axios.delete(url);
            if (currentItem.type === 'user') {
                setUsers(users.filter(user => user.id !== currentItem.id));
            } else if (currentItem.type === 'post') {
                setPosts(posts.filter(post => post.id !== currentItem.id));
            }
            closeModal();
        } catch (error) {
            console.error(`Error deleting ${currentItem.type}:`, error);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold text-center mb-8">Admin Dashboard</h1>
            <NavLink to="/createpost" className="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-150 ease-in-out mb-8">Create Post</NavLink>

            <section className="mb-8">
                <h2 className="text-3xl font-semibold mb-4">Users</h2>
                <ul>
                    {users.map(user => (
                        <li key={user.id} className="flex justify-between items-center bg-gray-100 p-4 rounded">
                            <span>{user.name} - {user.email}</span>
                            <button onClick={() => handleDeleteConfirmation('user', user.id)} className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700">Delete</button>
                        </li>
                    ))}
                </ul>
            </section>

            <section>
                <h2 className="text-3xl font-semibold mb-4">Posts</h2>
                <ul>
                    {posts.map(post => (
                        <li key={post.id} className="flex justify-between items-center bg-gray-100 p-4 rounded">
                            <span>{post.title}</span>
                            <div>
                                <NavLink to={`/edit-post/${post.id}`} className="inline-block bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 mr-2"
                                 data-cy={`edit-post-${post.id}`}>Edit</NavLink>                              
                                 <button onClick={() => handleDeleteConfirmation('post', post.id)} className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700">Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                className="m-auto bg-white rounded-lg p-4 max-w-xl w-full outline-none"
                overlayClassName="fixed inset-0 bg-black bg-opacity-30"
            >
                <h2 className="text-lg font-bold">Confirm Deletion</h2>
                <p>Are you sure you want to delete this {currentItem.type}?</p>
                <div className="flex justify-end space-x-2 mt-4">
                    <button onClick={closeModal} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
                    <button onClick={handleDelete} className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600">Yes, Delete</button>
                </div>
            </Modal>
        </div>
    );
};

export default AdminDashboard;