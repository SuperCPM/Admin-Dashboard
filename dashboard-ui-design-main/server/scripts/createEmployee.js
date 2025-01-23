import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../config.env') });

const DB = process.env.MONGO_URI;

mongoose.connect(DB).then(() => console.log('DB connection successful!'));

const createEmployee = async () => {
    try {
        await User.create({
            username: 'employee',
            password: 'employee123',
            role: 'employee'
        });
        console.log('Employee account created successfully!');
    } catch (error) {
        console.error('Error creating employee account:', error);
    }
    process.exit();
};

createEmployee();
