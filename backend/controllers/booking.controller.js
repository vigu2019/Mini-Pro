const db = require('../utils/db');

const getUserBookings = async (req, res) => {
    try {
        const user_id = req.user.id;

        const bookingsResult = await db.query(
            'SELECT * FROM bookings NATURAL JOIN travel_packages NATURAL JOIN travel_agencies WHERE user_id = $1',
            [user_id]
        );

        // Check if there are any bookings
        if (bookingsResult.rows.length === 0) {
            return res.status(404).json({ msg: 'No bookings found for this user' });
        }

        // Loop through each booking and fetch members
        const userBookings = await Promise.all(
            bookingsResult.rows.map(async (booking) => {
                const membersResult = await db.query(
                    'SELECT * FROM booking_members WHERE booking_id = $1',
                    [booking.booking_id]
                );
                return {
                    booking_id: booking.booking_id,
                    package_id: booking.package_id,
                    total_price: booking.total_price,
                    booking_date: booking.booking_date,
                    destination: booking.destination,
                    duration: booking.duration,
                    agency_name: booking.agency_name,
                    contact: booking.contact_info,
                    email: booking.email,
                    status: booking.booking_status,
                    bookingDetails: membersResult.rows,
                };
            })
        );
        res.status(200).json(userBookings); 
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Server error' });
    }
};



const createBooking = async (req, res) => {
    const { package_id,bookingDetails,totalAmount} = req.body;
    const user_id = req.user.id;
    try{
        const booking = await db.query('INSERT INTO bookings (user_id, package_id, total_price) VALUES ($1, $2, $3) RETURNING *', [user_id, package_id, totalAmount]);
        const booking_id = booking.rows[0].booking_id;
        bookingDetails.forEach(async (member) => {
            await db.query('INSERT INTO booking_members (booking_id, name, age, passport) VALUES ($1, $2, $3, $4)', [booking_id, member.name, member.age, member.passport]);
        });
        res.status(200).json({msg: 'Booking successful please contact the agency for verification and payment to confirm your booking'});
    }catch(err){
        console.error(err);
        return res.status(500).json({msg: 'Server error'});
    }
}

module.exports = {
    getUserBookings,
    createBooking
}