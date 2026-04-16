import dotenv from 'dotenv';
import connectDB from './config/database.js';
import createApp from './app.js';

dotenv.config();

connectDB();

const app = createApp();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
