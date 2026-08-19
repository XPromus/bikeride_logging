import { Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { GpxService } from './gpx.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { GpxUploadDto, type GpxUploadFile } from './gpx.dto';
import { GpxFileSizeValidationPipe, GpxFileTypeValidationPipe } from './gpx.validation';
import { RideGetDto } from 'src/schemas/ride.get.dto';
import { TrackPoint } from 'src/schemas/ride.schema';

@Controller('gpx')
export class GpxController {
    constructor(private readonly gpxService: GpxService) {}

    @Get()
    getTest(): string {
        return this.gpxService.getTest();
    }

    @Get(":id")
    @ApiResponse({ type: RideGetDto })
    async getRideById(
        @Param("id") id: string
    ): Promise<RideGetDto> {
        return this.gpxService.getRide(id);
    }

    @Get("/points/:id")
    @ApiResponse({ type: TrackPoint })
    async getRidePoints(
        @Param("id") id: string
    ): Promise<TrackPoint[]> {
        return this.gpxService.getRidePoints(id);
    }

    @Post("upload")
    @UseInterceptors(FileInterceptor("file"))
    @ApiConsumes("multipart/form-data")
    @ApiBody({ type: GpxUploadDto })
    async uploadGpx(
        @UploadedFile(
            new GpxFileSizeValidationPipe(),
            new GpxFileTypeValidationPipe(),
        ) file: GpxUploadFile
    ): Promise<RideGetDto> {
        const ride = this.gpxService.parseFile(file);
        return ride;
    }

}
