import React from 'react';

function CustomerDashboard() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Customer Dashboard</h1>
      <p className="text-lg">Welcome to your dashboard!</p>
      <div className="mt-6 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold">Your Information</h2>
        <p><strong>Name:</strong> John Doe</p>
        <p><strong>Email:</strong> johndoe@example.com</p>
        <p><strong>User Type:</strong> Customer</p>
      </div>
      <div className="mt-6">
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Book a New Slot
        </button>
      </div>
    </div>
  );
}

export default CustomerDashboard;
