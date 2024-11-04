import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { viewBookingRoute } from '../utils/ApiRoutes';
import { toast } from 'react-toastify';

const ViewBooking = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const getBookings = async () => {
        try {
            const response = await axios.get(viewBookingRoute, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setBookings(response.data.details || response.data || []);
        } catch (error) {
            console.error("Error fetching bookings:", error);
            toast.error("Failed to retrieve bookings. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        getBookings();
    }, []);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-4">Your Bookings</h1>

            {loading ? (
                <p>Loading your bookings...</p>
            ) : (
                bookings.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {bookings.map((booking) => (
                            <div key={booking.booking_id} className="p-6 bg-white rounded-lg shadow-lg">
                                <h3 className="text-lg font-bold mb-2">Booking id : {booking.package_id}</h3>
                                <p className="text-gray-700 mb-2"><strong>Date:</strong> {new Date(booking.booking_date).toDateString()}</p>
                                <p className="text-gray-700 mb-2"><strong>Destination:</strong> {booking.destination}</p>
                                <p className="text-gray-700 mb-2"><strong>Duration:</strong> {booking.duration} days</p>
                                <p className="text-gray-900 font-semibold"><strong>Total Amount:</strong> ${booking.total_price}</p>
                                <p className="text-gray-700 mb-2"><strong>Agency:</strong> {booking.agency_name}</p>
                                <p className="text-gray-700 mb-2"><strong>Agency Contact:</strong> {booking.contact}</p>
                                <p className="text-gray-700 mb-2"><strong>Agency Email:</strong> {booking.email}</p>
                                <p className="text-gray-700 mb-2"><strong>Status:</strong> {booking.status}</p>
                                <h4 className="text-md font-semibold mt-4">Booking Members</h4>
                                {booking.bookingDetails && booking.bookingDetails.length > 0 ? (
                                    booking.bookingDetails.map((member, index) => (
                                        <div key={index} className="mb-2">
                                            <p><strong>Name:</strong> {member.name}</p>
                                            <p><strong>Age:</strong> {member.age}</p>
                                            <p><strong>Passport:</strong> {member.passport}</p>
                                        </div>
                                    ))
                                
                                ) : (
                                    <p>No members found for this booking.</p>
                                )}
                                <p className={`text-gray-700 mt-4 ${booking.status === "pending" ? 'text-red-600' : 'text-green-600'}`}>
                                    {booking.status === "pending" ? (
                                        "Please contact the agency for verification and payment to confirm your booking."
                                    ) : (
                                        "You have successfully verified your booking."
                                    )}
                                </p>

                            </div>
                        ))}
                    </div>
                ) : (
                    <p>You have no bookings.</p>
                )
            )}
        </div>
    );
};

export default ViewBooking;
