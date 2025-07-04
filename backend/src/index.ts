import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import logger from './config/logger';
import { fileRoutes } from './route';

const app = express();
const PORT = process.env['PORT'] || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('combined')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies


app.use('/api/v1', fileRoutes);

// Start server
app.listen(Number(PORT) ,process.env['HOST'] || '0.0.0.0', () => {
  logger.info(`Server is running${process.env['HOST'] ? ` on ${process.env['HOST']}` : '0.0.0.0'} on port ${PORT}`);
});

export default app; 