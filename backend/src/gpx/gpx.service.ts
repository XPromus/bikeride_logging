import { Injectable } from "@nestjs/common";
import { GpxUploadFile } from "./gpx.dto";

@Injectable()
export class GpxService {
    parseFile(
        file: GpxUploadFile
    ): string {
        console.log(`Parsing: ${file.originalname}`)
        return "";
    }

    getTest(): string {
        return "GPX Test";
    }
}
