import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { adminRoutes } from '../utils/ApiRoutes';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [packages, setPackages] = useState([]);
  const [selectedSection, setSelectedSection] = useState('users');
  const [newPackage, setNewPackage] = useState({
    package_name: '',
    destination: '',
    duration: '',
    price: '',
    description: '',
    agent_id: ''
  });

  const fetchData = async (section) => {
    const routeMap = {
      users: adminRoutes.viewUsers,
      bookings: adminRoutes.viewBookings,
      packages: adminRoutes.viewPackages,
    };
    try {
      const response = await axios.get(routeMap[section], { headers: authHeader() });
      if (section === 'users') setUsers(response.data);
      else if (section === 'bookings') setBookings(response.data);
      else setPackages(response.data);
    } catch (error) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      toast.error(`Error fetching ${section}.`);
    }
  };

  useEffect(() => {
    fetchData(selectedSection);
  }, [selectedSection]);

  const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

  // Delete User
  const deleteUser = async (userId) => {
    try {
      await axios.delete(`${adminRoutes.deleteUser}/${userId}`, { headers: authHeader() });
      setUsers(users.filter(user => user.user_id !== userId));
      toast.success("User deleted successfully.");
    } catch (error) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      toast.error("Error deleting user.Login and try again");
    }
  };

  // Delete Package
  const deletePackage = async (packageId) => {
    try {
      const response = await axios.delete(`${adminRoutes.deletePackage}/${packageId}`, { headers: authHeader() });
      setPackages(packages.filter(pkg => pkg.package_id !== packageId));
      toast.success(response.data.msg);
    } catch (error) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      toast.error("Error deleting package.");
    }
  };

  // Update Booking Status
  const updateBookingStatus = async (bookingId, status) => {
    try {
      const response = await axios.put(`${adminRoutes.updateBooking}/${bookingId}`, { status }, { headers: authHeader() });
      setBookings(bookings.map(booking => booking.booking_id === bookingId ? { ...booking, booking_status: status } : booking));
      toast.success(response.data.msg);
    } catch (error) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      toast.error("Error updating booking status.");
    }
  };

  // Add New Package
  const handleAddPackage = async (e) => {
    e.preventDefault();
    try {
      await axios.post(adminRoutes.addPackage, newPackage, { headers: authHeader() });
      toast.success("Package added successfully.");
      setNewPackage({
        package_name: '',
        destination: '',
        duration: '',
        price: '',
        description: '',
        agent_id: ''
      });
      fetchData('packages');
    } catch (error) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      toast.error("Error adding package.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Section Navigation */}
      <div className="mb-4 flex space-x-2">
        <button onClick={() => setSelectedSection('users')} className="btn">Users</button>
        <button onClick={() => setSelectedSection('bookings')} className="btn">Bookings</button>
        <button onClick={() => setSelectedSection('packages')} className="btn">Packages</button>
      </div>

      {/* User Management */}
      {selectedSection === 'users' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">All Users</h2>
          {users.map(user => (
            <div key={user.user_id} className="bg-white p-4 mb-2 rounded-lg shadow-md flex justify-between items-center">
              <div>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
              </div>
              <button onClick={() => deleteUser(user.user_id)} className="text-red-500">Delete User</button>
            </div>
          ))}
        </div>
      )}

      {/* Booking Management */}
      {selectedSection === 'bookings' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">All Bookings</h2>
          {bookings.map(booking => (
            <div key={booking.booking_id} className="bg-white p-4 mb-2 rounded-lg shadow-md flex justify-between items-center">
              <div>
                <p><strong>Booking ID:</strong> {booking.booking_id}</p>
                <p><strong>Package:</strong> {booking.package_name}</p>
                <p><strong>Status:</strong> {booking.booking_status}</p>
                <p><strong>Date:</strong> {new Date(booking.booking_date).toDateString()}</p>
                <p><strong>Destination:</strong> {booking.destination}</p>
                <p><strong>Price:</strong> ${booking.total_price}</p>
                <p><strong>Agency:</strong> {booking.agency_name}</p>
                <table className="w-full border mt-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Age</th>
                  <th className="border px-4 py-2">Passport Number</th>
                </tr>
              </thead>
              <tbody>
                {booking.bookingDetails.map(member => (
                  <tr key={member.member_id}>
                    <td className="border px-4 py-2">{member.name}</td>
                    <td className="border px-4 py-2">{member.age}</td>
                    <td className="border px-4 py-2">{member.passport}</td>
                  </tr>
                ))}
              </tbody>
            </table>
              </div>
              <div>
              <button
                  onClick={() => updateBookingStatus(booking.booking_id, 'success')}
                  className="btn mr-2"
                >
                Confirm
              </button>

                {/* <button onClick={() => updateBookingStatus(booking.booking_id, 'canceled')} className="btn text-red-500">Cancel</button> */}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Package Management */}
      {selectedSection === 'packages' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">All Packages</h2>
          {packages.map(pkg => (
            <div key={pkg.package_id} className="bg-white p-4 mb-2 rounded-lg shadow-md flex justify-between items-center">
              <div>
                <p><strong>Package ID:</strong> {pkg.package_id}</p>
                <p><strong>Package Name:</strong> {pkg.package_name}</p>
                <p><strong>Destination:</strong> {pkg.destination}</p>
                <p><strong>Price:</strong> ${pkg.price}</p>
              </div>
              <div>
                <button onClick={() => deletePackage(pkg.package_id)} className="btn text-red-500">Delete Package</button>
              </div>
            </div>
          ))}

          {/* Add Package Form */}
          <h3 className="text-xl font-semibold mt-6 mb-4">Add New Package</h3>
          <form onSubmit={handleAddPackage} className="bg-white p-4 rounded-lg shadow-md">
            <input type="text" placeholder="Package Name" value={newPackage.package_name} onChange={(e) => setNewPackage({ ...newPackage, package_name: e.target.value })} className="input mb-2" required />
            <input type="text" placeholder="Destination" value={newPackage.destination} onChange={(e) => setNewPackage({ ...newPackage, destination: e.target.value })} className="input mb-2" required />
            <input type="number" placeholder="Duration" value={newPackage.duration} onChange={(e) => setNewPackage({ ...newPackage, duration: e.target.value })} className="input mb-2" required />
            <input type="number" placeholder="Price" value={newPackage.price} onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })} className="input mb-2" required />
            <textarea placeholder="Description" value={newPackage.description} onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })} className="input mb-2" required />
            <input type="text" placeholder="Agency ID" value={newPackage.agent_id} onChange={(e) => setNewPackage({ ...newPackage, agent_id: e.target.value })} className="input mb-2" required />
            <button type="submit" className="btn mt-2">Add Package</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
