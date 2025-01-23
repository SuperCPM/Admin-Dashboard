import mongoose from 'mongoose';

export const connection = async () => {
    try {
        const { connection } = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected to: ${connection.host}`);
    } catch (error) {
        console.log('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};
