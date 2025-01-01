import dotenv from "dotenv";

// load config from .env
dotenv.config({ path: "./src/.env" });

import express from 'express';
import cors from 'cors';
import helmet from 'helmet'; // Helmet for setting security-related HTTP headers
import path from 'path';
import fs from 'fs';
import uploadRoutes from './routes/upload.routes';
import { connectToMongoDB } from './database/mongoose';

// initialize database
connectToMongoDB();

// Initialize Express app
const app = express();
const port = process.env.PORT || 5000;

// Enable CORS for frontend communication
app.use(cors());
// Use Helmet to set secure HTTP headers to mitigate XSS, clickjacking, and other attacks
app.use(helmet());

// Ensure the "uploads" directory exists
const uploadsDir = path.resolve(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(uploadsDir)); // This line allows you to access files in the uploads directory

app.get('/', (req, res) => {
  res.send('Hello, World!');
})

// Import and use routes
app.use(uploadRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
