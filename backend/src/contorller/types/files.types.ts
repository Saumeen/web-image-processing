import { Transform } from "class-transformer";
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
        if (config?.requiredWidth !== undefined) this.requiredWidth = config.requiredWidth as number;
        if (config?.requiredHeight !== undefined) this.requiredHeight = config.requiredHeight as number;
        if (config?.requiredQuality !== undefined) this.requiredQuality = config.requiredQuality;
        if (config?.requiredFormat !== undefined) this.requiredFormat = config.requiredFormat;
        if (config?.requiredRotation !== undefined) this.requiredRotation = config.requiredRotation as number;
    }

    @IsOptional()
    @Transform(({ value }: { value: string }) => {
        if (typeof value === 'string') {
            return parseInt(value);
        }
        return value;
    })
    public requiredWidth?: number;

    @IsOptional()
    @Transform(({ value }: { value: string }) => {
        if (typeof value === 'string') {
            return parseInt(value);
        }
        return value;
    })
    public requiredHeight?: number;

    @IsOptional()
    @Transform(({ value }: { value: string }) => {
        if (typeof value === 'string') {
            return parseInt(value);
        }
        return value;
    })
    public requiredQuality?: number;

    @IsOptional()
    public requiredFormat?: string;

    @IsOptional()
    @Transform(({ value }: { value: string }) => {
        if (typeof value === 'string') {
            return parseInt(value);
        }
        return value;
    })
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



export interface IPDFFileRequest {
    requiredQuality?: number;
    requiredFormat?: string;
    requiredCompression?: 'low' | 'medium' | 'high';
}

export class PDFFileRequest {

    constructor(config: IPDFFileRequest){
        if (config?.requiredQuality !== undefined) this.requiredQuality = config.requiredQuality;
        if (config?.requiredFormat !== undefined) this.requiredFormat = config.requiredFormat;
        if (config?.requiredCompression !== undefined) this.requiredCompression = config.requiredCompression;
    }

    @IsOptional()
    @Transform(({ value }: { value: string }) => {
        if (typeof value === 'string') {
            return parseInt(value);
        }
        return value;
    })
    public requiredQuality?: number;

    @IsOptional()
    public requiredFormat?: string;

    @IsOptional()
    public requiredCompression?: 'low' | 'medium' | 'high';
}