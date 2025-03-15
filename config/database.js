const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log(`Connected to MongoDB: ${mongoose.connection.host}`);
    } catch (err) {
        console.error(`Error:, ${err.message}`); 
        process.exit(1);
    }
};

module.exports = connectDB;