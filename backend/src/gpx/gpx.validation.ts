import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { GpxUploadFile } from "./gpx.dto";

const ALLOWED_GPX_MIME_TYPES = [
    "application/gpx+xml",
    "application/xml",
    "text/xml",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

@Injectable()
export class GpxFileTypeValidationPipe implements PipeTransform {
    transform(
        value: GpxUploadFile | undefined, 
        metadata: ArgumentMetadata
    ) {
        if (!value) {
            throw new BadRequestException("No file uploaded");
        }

        const isGpxMime = ALLOWED_GPX_MIME_TYPES.includes(value.mimetype);
        const isGpxExtension = value.originalname.toLowerCase().endsWith(".gpx");

        if (!isGpxMime && !isGpxExtension) {
            throw new BadRequestException(
                `Invalid file type: expected a GPX file, received ${value.mimetype ?? "no file"}`
            );
        }

        return value;
    }
}

@Injectable()
export class GpxFileSizeValidationPipe implements PipeTransform {
    transform(
        value: GpxUploadFile | undefined, 
        metadata: ArgumentMetadata
    ) { 
        if (!value) {
            throw new BadRequestException("No file uploaded");
        }
        if (value.size > MAX_FILE_SIZE) {
            throw new BadRequestException(
                `File too large: expected max ${MAX_FILE_SIZE} bytes`
            );
        }
        
        return value;
    }
}
