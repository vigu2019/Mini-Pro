import React, { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import axios from 'axios';
import { loginRoute } from '../utils/ApiRoutes';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Login() {
  const { setAuthUser } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(loginRoute, { email, password });
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      setAuthUser(data.user);
      toast.success('Logged in successfully!');
      data.user.user_type === 'admin' ? navigate('/admin-dashboard') : navigate('/customer-dashboard');
    } catch (err) {
      toast.error(err.response.data.msg || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-md">Login</button>
        </form>
      </div>
    </div>
  );
}
