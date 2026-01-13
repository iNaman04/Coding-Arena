import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './db.js';
import dotenv from 'dotenv';
import authRoutes from './routes/auth_route.js';

dotenv.config({ path: "../.env" });  // it is for handling .env file 

const app = express();


app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);

connectDB().then(() => {
  console.log("Database connected successfully");
}).catch((err) => {
  console.error("Database connection failed", err);
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
