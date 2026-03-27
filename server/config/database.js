import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    const mongoURI = process.env.NODE_ENV === 'test'
      ? process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/creators-platform-test'
      : process.env.MONGODB_URI || 'mongodb://localhost:27017/creators-platform';

    await mongoose.connect(mongoURI);

    console.log('MongoDB connected successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

export default connectDB;
