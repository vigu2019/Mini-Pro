const db = require('../utils/db');

const deleteUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        await db.query('DELETE FROM users WHERE user_id = $1', [userId]);
        res.status(200).json({ msg: 'User deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Server error' });
    }
}

const getAllBookings = async (req, res) => {
    try {
        const bookingsResult = await db.query(
            'SELECT * FROM bookings NATURAL JOIN travel_packages NATURAL JOIN travel_agencies'
        );

        const bookingsWithMembers = await Promise.all(
            bookingsResult.rows.map(async (booking) => {
                const membersResult = await db.query(
                    'SELECT * FROM booking_members WHERE booking_id = $1',
                    [booking.booking_id]
                );
                return {
                    ...booking,
                    bookingDetails: membersResult.rows
                };
            })
        );

        res.status(200).json(bookingsWithMembers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Failed to fetch bookings' });
    }
};


const deletePackageById = async (req, res) => { 
    try {
        const packageId = req.params.packageId;
        await db.query('DELETE FROM travel_packages WHERE package_id = $1', [packageId]);
        res.status(200).json({ msg: 'Package deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Server error' });
    }
}



const updateBookingStatus = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        console.log(req.params);
        const { status } = req.body;
        await db.query('UPDATE bookings SET booking_status = $1 WHERE booking_id = $2', [status, bookingId]);
        res.status(200).json({ msg: 'Booking status updated successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Server error' });
    }
}

const addPackage = async (req, res) => {
    const { destination, duration, price, description, agent_id, package_name } = req.body;
    try {
        await db.query(
            'INSERT INTO travel_packages (destination, duration, price, description, agent_id, package_name) VALUES ($1, $2, $3, $4, $5, $6)',
            [destination, duration, price, description, agent_id, package_name]
        );
        res.status(201).json({ msg: 'Package added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Failed to add package' });
    }
};

const getAllPackages = async (req, res) => {
    try {
        const packages = await db.query('SELECT * FROM travel_packages NATURAL JOIN travel_agencies');
        res.status(200).json(packages.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Failed to fetch packages' });
    }
}
const getAllUsers = async (req, res) => {
    try {
        const users = await db.query('SELECT * FROM users');
        res.status(200).json(users.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Failed to fetch users' });
    }
}

module.exports = {
    deleteUserById,
    getAllBookings,
    deletePackageById,
    // updatePackageDetails,
    updateBookingStatus,
    getAllPackages,
    addPackage,
    getAllUsers
};