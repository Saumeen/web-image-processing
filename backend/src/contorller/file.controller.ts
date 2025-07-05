import { Request, Response } from "express";
import logger from "../config/logger";
import { processImageService } from "../service/file.service";
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
        const {metadata, resizableImage} = await processImageService(file, fileRequest);

        // Convert the buffer to the downloadable image
        // Set appropriate headers for image download
        const mimeType = formatToMime[metadata.format] || 'application/octet-stream';
        const ext = formatToExt[metadata.format] || 'bin';
        res.setHeader('Content-Type', mimeType);
        res.setHeader('x-file-metadata', JSON.stringify({
            width: `${metadata.width} px`,
            height: `${metadata.height} px`,
            format: metadata.format,
            size: `${Math.round(resizableImage.length/1024)} KB`,
        }));
        res.setHeader('Content-Disposition', `attachment; filename="processed-image.${ext}"`);
        res.setHeader('Content-Length', resizableImage.length);
        return res.send(resizableImage);
    } catch (error) {
        logger.error('Error in processImageController', error);
        return new ApiResponse(`Error While Processing the request.`, 500);
    }
}

export { processImageController };