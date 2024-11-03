const db = require('../utils/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Field validations
        if (!name || !email || !password) {
            return res.status(400).json({ msg: 'Please fill in all fields' });
        }

        // Validate email
        if (!validator.isEmail(email)) {
            return res.status(400).json({ msg: 'Invalid email' });
        }

        // Check if user already exists
        const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length > 0) {
            return res.status(400).json({ msg: 'Email already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Insert new user into the database
        const newUser = await db.query(
            'INSERT INTO users (name, email, password, user_type) VALUES ($1, $2, $3, $4) RETURNING *', 
            [name, email, passwordHash, 'customer']
        );

        // Respond with the new user's data (excluding the password)
        res.status(201).json({ 
            msg: 'Registered successfully', 
        });

    } catch (err) {
        console.error(err); 
        return res.status(500).json({ msg: 'Server error' });
    }
};

const signInUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input fields
        if (!email || !password) {
            return res.status(400).json({ msg: 'Please fill in all fields' });
        }

        // Check if user exists
        const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.rows[0].user_id , user_type: user.rows[0].user_type }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie("token",token,{httpOnly:true});
        res.json({ 
            token, 
            user: { 
                id: user.rows[0].id, 
                email: user.rows[0].email, 
                name: user.rows[0].name ,
                user_type: user.rows[0].user_type
            } 
        });
    } catch (err) {
        console.error(err);  // Improved error logging for server side
        return res.status(500).json({ msg: 'Server error' });
    }
};

const logoutUser = async (req, res) => {
    res.clearCookie('token');
    res.json({ msg: 'Logged out' });
};


module.exports = {
    registerUser,
    signInUser,
    logoutUser
};