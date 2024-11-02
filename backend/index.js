const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/user.routes');
const travelRoutes = require('./routes/travel.routes');

app.use(cors({
    origin: 'http://localhost:3000',
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use('/api/auth', userRoutes);
app.use('/api/travel', travelRoutes);


app.listen(process.env.PORT, () => {
    console.log('Server is running on port ' + process.env.PORT);
});