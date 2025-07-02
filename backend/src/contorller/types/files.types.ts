import { IsOptional } from "class-validator";

interface IFileRequest {
    requiredWidth?: number;
    requiredHeight?: number;
    requiredQuality?: number;
    requiredFormat?: string;
    requiredRotation?: number;
}

export class FileRequest {

    constructor(config: IFileRequest) {
        if (config?.requiredWidth !== undefined) this.requiredWidth = config.requiredWidth;
        if (config?.requiredHeight !== undefined) this.requiredHeight = config.requiredHeight;
        if (config?.requiredQuality !== undefined) this.requiredQuality = config.requiredQuality;
        if (config?.requiredFormat !== undefined) this.requiredFormat = config.requiredFormat;
        if (config?.requiredRotation !== undefined) this.requiredRotation = config.requiredRotation;
    }

    @IsOptional()
    public requiredWidth?: number;

    @IsOptional()
    public requiredHeight?: number;

    @IsOptional()
    public requiredQuality?: number;

    @IsOptional()
    public requiredFormat?: string;

    @IsOptional()
    public requiredRotation?: number;
}


// Helper to map sharp format to MIME type and extension
export const formatToMime: Record<string, string> = {
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp'
};
export const formatToExt: Record<string, string> = {
    jpeg: 'jpg',
    png: 'png',
    webp: 'webp'
};