import sharp from 'sharp';
import logger from '../config/logger';
import { FileRequest } from '../contorller/types/files.types';
import { ApiError } from '../helper/error.helper';
import {compress} from 'compress-pdf';

const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const SUPPORTED_PDF_FILE_TYPES = ['application/pdf']

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
        const quality = fileRequest.requiredQuality as number || 80; // Default quality of 80

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

        return { metadata, resizableImage };
    } catch (error) {
        logger.error('Error in processImage', error);
        throw error;
    }
}

const processPDFService = async (file: Express.Multer.File) => {

    // file extension should be pdf only
    if (!SUPPORTED_PDF_FILE_TYPES.includes(file.mimetype)) {
        throw new ApiError(` ${file.mimetype} not supported. Only supported ${SUPPORTED_PDF_FILE_TYPES.join(',').toString()}`, 400);
    }

    try {
        logger.info(`Request for PDF processing service`);

        // Compress the PDF using compress-pdf
        const compressedBuffer = await compress(file.buffer);

        // Get original file size for comparison
        const originalSize = `${file.buffer.length / 1024} KB`;
        const compressedSize = `${compressedBuffer.length / 1024} KB`;
        const compressionRatio = ((file.buffer.length - compressedBuffer.length) / file.buffer.length * 100).toFixed(2);

        logger.info(`PDF compressed successfully. Original size: ${originalSize} bytes, Compressed size: ${compressedSize} bytes, Compression: ${compressionRatio}%`);

        return {
            compressedBuffer,
            metadata: {
                originalSize,
                compressedSize,
                compressionRatio: parseFloat(compressionRatio),
            }
        };

    } catch (error) {
        logger.error('Error in processPDFService', error);
        throw new ApiError(`Failed to process PDF: ${error instanceof Error ? error.message : 'Unknown error'}`, 500);
    }
};

export { processImageService, processPDFService };