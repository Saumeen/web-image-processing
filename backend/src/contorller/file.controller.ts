import { Request, Response } from "express";
import logger from "../config/logger";
import { processImageService, processPDFService } from "../service/file.service";
import { mapAndValidateJsonData } from "../helper/mapper";
import { FileRequest, formatToExt, formatToMime } from "./types/files.types";
import { ApiResponse } from "../helper/error.helper";

const processImageController = async (req: Request, res: Response) => {
    try {
        const fileRequest = mapAndValidateJsonData<FileRequest>(JSON.stringify(req.body), FileRequest);

        const file = req.file;
        if (!file) {
            return new ApiResponse(`Please provide valid image for processing`, 400);
        }
        const { metadata, resizableImage } = await processImageService(file, fileRequest);

        // Convert the buffer to the downloadable image
        // Set appropriate headers for image download
        const mimeType = formatToMime[metadata.format] || 'application/octet-stream';
        const ext = formatToExt[metadata.format] || 'bin';
        res.setHeader('Content-Type', mimeType);
        res.setHeader('x-file-metadata', JSON.stringify({
            width: `${fileRequest.requiredWidth || metadata.width} px`,
            height: `${fileRequest.requiredHeight || metadata.height} px`,
            format: fileRequest.requiredFormat || metadata.format,
            size: `${Math.round(resizableImage.length / 1024)} KB`,
        }));
        res.setHeader('Content-Disposition', `attachment; filename="processed-image.${ext}"`);
        res.setHeader('Content-Length', resizableImage.length);
        return res.send(resizableImage);
    } catch (error) {
        logger.error('Error in processImageController', error);
        return new ApiResponse(`Error While Processing the request.`, 500);
    }
}

const processPDFController = async (req: Request, res: Response) => {
    try {

        const file = req.file;
        if (!file) {
            return new ApiResponse(`Please provide valid PDF file for processing`, 400);
        }

        const { metadata, compressedBuffer } = await processPDFService(file);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('x-pdf-metadata', JSON.stringify({
            fileName:file.filename,
            originalSize: metadata.originalSize,
            compressedSize: metadata.compressedSize,
            compressionRatio: metadata.compressionRatio,
        }));
        res.setHeader('Content-Disposition', `attachment; filename="${file.filename}.pdf"`);
        res.setHeader('Content-Length', compressedBuffer.length);
        return res.send(compressedBuffer);
    } catch (error) {
        logger.error('Error in processPDFController', error);
        return new ApiResponse(`Error While Processing the PDF request.`, 500);
    }
}

export { processImageController, processPDFController };