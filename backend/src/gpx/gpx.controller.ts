import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { GpxService } from './gpx.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { GpxUploadDto, type GpxUploadFile } from './gpx.dto';
import { GpxFileSizeValidationPipe, GpxFileTypeValidationPipe } from './gpx.validation';

@Controller('gpx')
export class GpxController {
    constructor(private readonly gpxService: GpxService) {}

    @Get()
    getTest(): string {
        return this.gpxService.getTest();
    }

    @Post("upload")
    @UseInterceptors(FileInterceptor("file"))
    @ApiConsumes("multipart/form-data")
    @ApiBody({ type: GpxUploadDto })
    uploadGpx(
        @UploadedFile(
            new GpxFileSizeValidationPipe(),
            new GpxFileTypeValidationPipe(),
        ) file: GpxUploadFile
    ) {
        this.gpxService.parseFile(file);
    }

}
