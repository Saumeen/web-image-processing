import sharp from 'sharp';
import logger from '../config/logger';
import { FileRequest } from '../contorller/types/files.types';

const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const processImageService = async (file: Express.Multer.File, fileRequest: FileRequest) => {
    try {
        if (!SUPPORTED_IMAGE_TYPES.includes(file.mimetype)) {
            throw new Error('Unsupported file format');
        }
        logger.info(`Request for image processing service ${JSON.stringify(fileRequest)}`)
        const image = sharp(file.buffer);
        const metadata = await image.metadata();
        const resizableImage = await image.resize(Math.round(metadata.width/2), Math.round(metadata.height/2)).toBuffer();
        return {metadata , resizableImage};
    } catch (error) {
        logger.error('Error in processImage', error);
        throw error;
    }
}

export { processImageService };