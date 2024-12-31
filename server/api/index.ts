import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet'; // Helmet for setting security-related HTTP headers

// Initialize Express app
const app = express();
const port = 5000;

// Enable CORS for frontend communication
app.use(cors());

// Use Helmet to set secure HTTP headers to mitigate XSS, clickjacking, and other attacks
app.use(helmet());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

export default app;
