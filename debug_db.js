const mongoose = require('mongoose');
const User = require('./server/models/User');

const MONGO_URI = 'mongodb+srv://ashkam58:mongodb123@cluster0.qs4xu.mongodb.net/?appName=Cluster0';

async function testDB() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected!');

        console.log('Testing User Upsert...');
        const testName = 'DebugUser_' + Date.now();

        const newUser = new User({ name: testName });
        await newUser.save();
        console.log('User saved successfully:', newUser._id);

        const foundUser = await User.findById(newUser._id);
        console.log('User found:', foundUser.name);

        console.log('Testing User Query...');
        const queryUser = await User.findOne({ name: testName });
        console.log('User queried:', queryUser ? 'Found' : 'Not Found');

        console.log('ALL TESTS PASSED');
    } catch (err) {
        console.error('DB TEST FAILED:', err);
    } finally {
        await mongoose.disconnect();
    }
}

testDB();
