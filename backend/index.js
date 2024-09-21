const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const morgan = require('morgan');

const userRoutes = require('./routes/userRoutes');

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));
app.use('/api/auth', userRoutes);

app.listen(process.env.PORT, () => {
    console.log('Server is running on port ' + process.env.PORT);
});