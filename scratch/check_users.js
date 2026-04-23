require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./backend/models/User');

async function checkUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');
        const users = await User.find({}, 'username email firstName');
        console.log('Users found:');
        console.log(JSON.stringify(users, null, 2));
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkUsers();
