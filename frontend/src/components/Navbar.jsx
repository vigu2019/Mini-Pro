import React from 'react';
import { useAuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { logoutRoute } from '../utils/ApiRoutes';

export default function Navbar() {
  const { authUser, setAuthUser } = useAuthContext();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const response = await axios.get(logoutRoute, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setAuthUser(null);
      navigate('/login');
      toast.success(response.data.msg);
    } catch (err) {
      toast.error("Failed to logout");
      console.error(err);
    }
  };
  

  return (
    <div className="navbar bg-base-100 sticky top-0 w-full z-10">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">Travel Agency</Link>
      </div>
      <div className="flex-none">
        {authUser ? (
          <>
            <div className="text-xl font-semibold">Welcome! {authUser.name}</div>
            <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                <span className="text-white text-lg leading-none flex items-center justify-center h-full">
                  {authUser.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
              <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
          </div>
          </>
        ) : (
          <div className="flex gap-2">
            <Link to="/register" className="btn btn-ghost">Register</Link>
            <Link to="/login" className="btn btn-ghost">Login</Link>
          </div>
        )}
      </div>
    </div>
  );
}
