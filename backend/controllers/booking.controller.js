const db = require('../utils/db');

const getUserBookings = async (req, res) => {
    try{
        const user_id = req.user.id;
        const userBookings = await db.query('SELECT * FROM bookings WHERE user_id = $1', [user_id]);
        res.status(200).json(userBookings.rows);
    }
    catch(err){
        console.error(err);
        return res.status(500).json({msg: 'Server error'});
    }
}