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
        
        // Apply resize if dimensions are specified
        let processedImage = image;
        if (fileRequest.requiredWidth || fileRequest.requiredHeight) {
            processedImage = image.resize(
                fileRequest.requiredWidth || undefined,
                fileRequest.requiredHeight || undefined
            );
        }
        
        // Apply rotation if specified
        if (fileRequest.requiredRotation) {
            processedImage = processedImage.rotate(fileRequest.requiredRotation);
        }
        
        // Convert to specified format with quality settings
        let resizableImage: Buffer;
        const format = fileRequest.requiredFormat || metadata.format || 'jpeg';
        const quality = fileRequest.requiredQuality || 80; // Default quality of 80
        
        switch (format.toLowerCase()) {
            case 'jpeg':
            case 'jpg':
                resizableImage = await processedImage
                    .jpeg({ quality: Math.max(1, Math.min(100, quality)) })
                    .toBuffer();
                break;
            case 'png':
                resizableImage = await processedImage
                    .png({ quality: Math.max(1, Math.min(100, quality)) })
                    .toBuffer();
                break;
            case 'webp':
                resizableImage = await processedImage
                    .webp({ quality: Math.max(1, Math.min(100, quality)) })
                    .toBuffer();
                break;
            default:
                resizableImage = await processedImage.toBuffer();
        }
        
        return {metadata , resizableImage};
    } catch (error) {
        logger.error('Error in processImage', error);
        throw error;
    }
}

export { processImageService };