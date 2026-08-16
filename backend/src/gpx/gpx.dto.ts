import { ApiProperty } from "@nestjs/swagger";

export class GpxUploadDto {
    @ApiProperty({ type: "string", format: "binary" })
    file: GpxUploadFile;

    constructor(
        file: GpxUploadFile
    ) { 
        this.file = file;
    }
}

export interface GpxUploadFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
};
