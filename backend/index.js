const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Import the cors package
const connectDB = require('./config/database');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use(cors()) ;

// Mount auth routes
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

// Mount poll routes
const pollRoutes = require('./routes/pollRoutes');
app.use('/polls', pollRoutes);


const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});