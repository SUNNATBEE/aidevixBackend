require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function checkUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const users = await User.find({}, 'username email firstName');
        console.log('START_USERS');
        console.log(JSON.stringify(users, null, 2));
        console.log('END_USERS');
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkUsers();
