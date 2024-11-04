import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { packagesRoute, eachPackageRoute, bookingRoute } from '../utils/ApiRoutes';
import Modal from '../components/Modal';
import { toast } from 'react-toastify';

const CustomerDashboard = () => {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [bookingDetails, setBookingDetails] = useState([{ name: '', age: '', passport: '' }]);

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
      toast.error("Access denied. Please login to continue.");
      if (error.response.status === 403) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
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
      if (err.response.status === 403) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
      console.error(err);
    }
  };
  
  const openModal = async (pkg) => {
    await fetchModalData(pkg);
    setIsModalOpen(true);
  };

  const openBookingModal = (pkg) => {
    setSelectedPackage(pkg); // Set the selected package for booking
    setIsBookingModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPackage(null);
    setIsModalOpen(false);
  };

  const closeBookingModal = () => {
    setBookingDetails([{ name: '', age: '', passport: '' }]);
    setIsBookingModalOpen(false);
    setIsPreview(false);
  };

  const handleBookingChange = (index, field, value) => {
    const updatedDetails = [...bookingDetails];
    updatedDetails[index][field] = value;
    setBookingDetails(updatedDetails);
  };

  const addMember = () => {
    setBookingDetails([...bookingDetails, { name: '', age: '', passport: '' }]);
  };

  const removeMember = (index) => {
    if (bookingDetails.length === 1) {
      return;
    }
    const updatedDetails = bookingDetails.filter((_, i) => i !== index);
    setBookingDetails(updatedDetails);
  };

  const calculateTotalAmount = (price, noOfMembers) => {
    return price * noOfMembers;
  };

  const handlePreview = () => {
    if (bookingDetails.some((member) => Object.values(member).some((value) => !value))) {
      toast.error("Please fill in all fields");
      return;
    }
    setIsPreview(true);
  };

  const handleEdit = () => {
    setIsPreview(false);
  };

  const handleBookingSubmit = async () => {
    if (bookingDetails.some((member) => Object.values(member).some((value) => !value))) {
      toast.error("Please fill in all fields");
      return;
    }
  
    try {
      const response = await axios.post(
        bookingRoute,
        {
          package_id: selectedPackage.package_id,
          bookingDetails,
          totalAmount: calculateTotalAmount(selectedPackage.price, bookingDetails.length)
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
  
      if (response.status === 200) {
        toast.success(response.data.msg);
        closeBookingModal();
      } else {
        toast.error("Booking failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      if (error.response.status === 403) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
      toast.error("An error occurred while processing the booking.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Your Dashboard</h1>

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
                    onClick={() => openBookingModal(pkg)} 
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

      {/* Package Details Modal */}
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

      <Modal isOpen={isBookingModalOpen} onClose={closeBookingModal}>
        <h2 className="text-xl font-bold mb-4">{isPreview ? "Preview Booking Details" : "Booking Details"}</h2>

        {!isPreview ? (
          <>
            {bookingDetails.map((member, index) => (
              <div key={index} className="mb-4">
                <h3 className="text-lg font-semibold">Member {index + 1}</h3>
                <input
                  type="text"
                  placeholder="Name"
                  value={member.name}
                  onChange={(e) => handleBookingChange(index, 'name', e.target.value)}
                  className="border p-2 w-full mt-2"
                  required
                />
                <input
                  type="number"
                  placeholder="Age"
                  value={member.age}
                  onChange={(e) => handleBookingChange(index, 'age', e.target.value)}
                  className="border p-2 w-full mt-2"
                  required
                />
                <input
                  type="text"
                  placeholder="Passport Number"
                  value={member.passport}
                  onChange={(e) => handleBookingChange(index, 'passport', e.target.value)}
                  className="border p-2 w-full mt-2"
                />
                <button
                  onClick={() => removeMember(index)}
                  className="text-red-500 hover:underline mt-2"
                >
                  Remove
                </button>
              </div>
            ))}
            <button onClick={addMember} className="text-blue-500 hover:underline mt-2 mr-2">
              Add Another Member
            </button>
            <button onClick={handlePreview} className="bg-yellow-500 text-white px-4 py-2 rounded mt-4">
              Preview
            </button>
          </>
        ) : (
          <>
            <table className="w-full border mt-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Age</th>
                  <th className="border px-4 py-2">Passport Number</th>
                </tr>
              </thead>
              <tbody>
                {bookingDetails.map((member, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{member.name}</td>
                    <td className="border px-4 py-2">{member.age}</td>
                    <td className="border px-4 py-2">{member.passport}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-lg mt-4"><strong>Total Amount:</strong> ${calculateTotalAmount(selectedPackage.price, bookingDetails.length)}</p>
            <button onClick={handleEdit} className="text-blue-500 hover:underline mt-4 mr-2">
              Edit Details
            </button>
            <button onClick={handleBookingSubmit} className="bg-green-500 text-white px-4 py-2 rounded mt-4">
              Confirm Booking
            </button>
          </>
        )}
      </Modal>
    </div>
  );
};

export default CustomerDashboard;
