
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { packagesRoute } from '../utils/ApiRoutes';
import Modal from '../components/Modal';
import { eachPackageRoute } from '../utils/ApiRoutes';

const CustomerDashboard = () => {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getPackageDetails = async () => {
    try {
      const response = await axios.get(packagesRoute, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setPackages(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPackageDetails();
  }, []);

  const fetchModalData = async (pkg) => {
    try {
      const response = await axios.get(`${eachPackageRoute}/${pkg.package_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setSelectedPackage(response.data[0]);
    } catch (err) {
      console.error(err);
    }
  };
  

  const openModal = async (pkg) => {
    await fetchModalData(pkg);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPackage(null);
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Your Dashboard</h1>
      {/* <p className="text-lg mb-6">Welcome to your dashboard!</p> */}

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Packages</h2>
        {packages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {packages.map((pkg) => (
              <div key={pkg.package_id} className="p-6 bg-white rounded-lg shadow-lg transform transition duration-500 hover:scale-105">
                <h3 className="text-lg font-bold mb-2">Package {pkg.package_id}</h3>
                <p className="text-gray-700 mb-2"><strong>Destination:</strong> {pkg.destination}</p>
                <p className="text-gray-700 mb-2"><strong>Duration:</strong> {pkg.duration} days</p>
                <p className="text-gray-700 mb-2"><strong>Description:</strong> {pkg.description}</p>
                <p className="text-gray-900 font-semibold"><strong>Price:</strong> ${pkg.price}</p>
                <div className="flex mt-4 space-x-2">
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => openModal(pkg)}
                  >
                    View More
                  </button>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No packages available.</p>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {selectedPackage && (
          <div>
            <h2 className="text-xl font-bold mb-4">Package {selectedPackage.package_id}</h2>
            <p><strong>Destination:</strong> {selectedPackage.destination}</p>
            <p><strong>Duration:</strong> {selectedPackage.duration} days</p>
            <p><strong>Description:</strong> {selectedPackage.description}</p>
            <p><strong>Price:</strong> ${selectedPackage.price}</p>
            <p><strong>Agency:</strong> {selectedPackage.agency_name}</p>
            <p><strong>Contact:</strong> {selectedPackage.contact_info}</p>
            <p><strong>Email:</strong> {selectedPackage.email}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CustomerDashboard;
