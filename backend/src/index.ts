import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import logger from './config/logger';
import { fileRoutes } from './route';

const app = express();
const PORT = process.env['PORT'] || 8080;

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  exposedHeaders: ['X-File-Metadata'],
})); // Enable CORS
app.use(morgan('combined')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies


app.use('/api/v1', fileRoutes);

// Start server
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

export default app; 