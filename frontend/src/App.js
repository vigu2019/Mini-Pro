import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ViewBooking from './pages/ViewBooking';

function App() {
  const { authUser } = useAuthContext();
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={authUser ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={authUser ? <Navigate to="/" /> : <Register />} />
        <Route path="/customer-dashboard" element={authUser && authUser.user_type === 'customer' ? <CustomerDashboard /> : <Navigate to="/login" />} />
        <Route path="/bookings" element={authUser && authUser.user_type ? <ViewBooking /> : <Navigate to="/login" />} />
        <Route path="/admin-dashboard" element={authUser && authUser.user_type === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
        <Route path="/" element={authUser ? (
          authUser.user_type === 'admin' ? <Navigate to="/admin-dashboard" /> : <Navigate to="/customer-dashboard" />
        ) : <Navigate to="/login" />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
