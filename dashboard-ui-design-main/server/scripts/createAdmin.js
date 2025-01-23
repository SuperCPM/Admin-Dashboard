import mongoose from 'mongoose';
import { config } from 'dotenv';
import { User } from '../models/User.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: path.join(__dirname, '../config.env') });

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to database');

        const adminUser = await User.create({
            username: 'admin',
            password: 'admin123',
            role: 'admin'
        });

        console.log('Admin user created successfully:', adminUser);
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
};

createAdmin();
