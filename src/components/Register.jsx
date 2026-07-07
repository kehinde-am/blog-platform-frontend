import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { registerUser } from '../api';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const Register = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (userData.password !== userData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    const { name, email, password } = userData;
    try {
      await registerUser({ name, email, password });
      toast.success('Account created successfully!', {
        onClose: () => navigate('/login'),
      });
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.');
    }
  };

  const fields = [
    { id: 'name', label: 'Full name', type: 'text', key: 'name', placeholder: 'Jane Doe' },
    { id: 'email', label: 'Email address', type: 'email', key: 'email', placeholder: 'you@example.com' },
    { id: 'password', label: 'Password', type: passwordVisible ? 'text' : 'password', key: 'password', placeholder: 'Min. 8 characters', toggle: () => setPasswordVisible(!passwordVisible), visible: passwordVisible },
    { id: 'confirmPassword', label: 'Confirm password', type: confirmPasswordVisible ? 'text' : 'password', key: 'confirmPassword', placeholder: 'Repeat your password', toggle: () => setConfirmPasswordVisible(!confirmPasswordVisible), visible: confirmPasswordVisible },
  ];

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl font-bold text-stone-900 mb-2">
            Join Verse
          </h2>
          <p className="text-stone-500">Create your account and start exploring</p>
        </div>

        <div className="card p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {fields.map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-sm font-medium text-stone-700 mb-1.5">
                  {field.label}
                </label>
                <div className="relative">
                  <input
                    id={field.id}
                    name={field.id}
                    type={field.type}
                    required
                    className="input-field pr-12"
                    placeholder={field.placeholder}
                    value={userData[field.key]}
                    onChange={(e) => setUserData({ ...userData, [field.key]: e.target.value })}
                  />
                  {field.toggle && (
                    <button
                      type="button"
                      onClick={field.toggle}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-stone-400 hover:text-stone-600"
                    >
                      {field.visible ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button type="submit" className="btn-primary w-full">
              Create account
            </button>
          </form>

          <p className="text-center text-sm text-stone-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
