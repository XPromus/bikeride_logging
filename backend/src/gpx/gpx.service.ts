import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { GpxUploadFile } from "./gpx.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Ride, RideDocument, TrackPoint } from "src/schemas/ride.schema";
import { XMLParser } from "fast-xml-parser";
import { NotFoundError } from "rxjs";
import { RideGetDto } from "src/schemas/ride.get.dto";

const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
});

interface GpxTrkpt {
    "@_lat": string;
    "@_lon": string;
    ele?: number;
    time?: string;
}

interface GpxTrk {
    name?: string;
    time?: string;
    trkseg?: { trkpt: GpxTrkpt | GpxTrkpt[] };
}

interface GpxData {
    gpx: {
        metadata?: { name?: string, time?: string };
        trk?: GpxTrk;
    }
}

@Injectable()
export class GpxService {
    private readonly logger = new Logger(GpxService.name);

    constructor(
        @InjectModel(Ride.name) private readonly rideModel: Model<RideDocument>
    ) {}

    async parseFile(
        file: GpxUploadFile
    ): Promise<RideGetDto> {
        this.logger.log(`Parsing: ${file.originalname}`);

        const gpxString = file.buffer.toString();
        const parsed: GpxData = parser.parse(gpxString);
        const gpx = parsed.gpx;
        const trk = gpx.trk;

        const name = gpx.metadata?.name ?? trk?.name ?? file.originalname;
        const date = new Date(gpx.metadata?.time ?? trk?.time ?? Date.now());

        let rawPoints: GpxTrkpt[] = [];
        if (trk?.trkseg?.trkpt) {
            rawPoints = Array.isArray(trk.trkseg.trkpt) ? trk.trkseg.trkpt : [trk.trkseg.trkpt];
        }

        let totalDistance = 0;
        let totalElevation = 0;
        let movingTime = 0;

        const trackPoints: TrackPoint[] = [];

        for (let i = 0; i < rawPoints.length; i++) {
            const point = rawPoints[i];
            const lat = parseFloat(point["@_lat"]);
            const lon = parseFloat(point["@_lon"]);
            const ele = point.ele ?? 0;
            const time = point.time ? new Date(point.time) : undefined;
            
            trackPoints.push({ latitude: lat, longitude: lon, elevation: ele, time });

            if (i > 0) {
                const prev = rawPoints[i - 1];
                const prevLat = parseFloat(prev["@_lat"]);
                const prevLon = parseFloat(prev["@_lon"]);
                const prevEle = prev.ele ?? 0;

                const distance = this.haversine(prevLat, prevLon, lat, lon);
                totalDistance += distance;

                const elevDiff = ele - prevEle;
                if (elevDiff > 0) totalElevation += elevDiff;

                if (point.time && prev.time) {
                    const deltaTime = (new Date(point.time).getTime() - new Date(prev.time).getTime()) / 1000;
                    if (deltaTime > 0 && distance / deltaTime > 0.278) movingTime += deltaTime; // Filter out stopped (speed < 0.278 m/s)
                }
            }
        }

        const averageSpeed = movingTime > 0 ? (totalDistance / movingTime) * 3.6 : 0;
        const newRide = await this.rideModel.create({
            name,
            date,
            distance: Math.round(totalDistance * 100) / 100,
            elevation: Math.round(totalElevation),
            avgSpeed: Math.round(averageSpeed * 100) / 100,
            points: trackPoints,
            rawGpx: gpxString,
        });

        this.logger.log(`Saved ride: ${newRide._id}`);
        const { points, rawGpx, ...rideWithoutGpx } = newRide.toObject();
        return rideWithoutGpx;
    }

    async getRide(id: string): Promise<RideGetDto> {
        const ride = await this.rideModel.findById(id).select("-rawGpx").exec();
        if (!ride) {
            throw new NotFoundException(`Ride ${id} not found!`);
        }
        return ride;
    }

    async getRides(): Promise<RideGetDto[]> {
        return this.rideModel.find().select("-rawGpx").exec();
    }

    async getRidePoints(id: string): Promise<TrackPoint[]> {
        const ride = await this.rideModel.findById(id).exec();
        if (!ride) {
            throw new NotFoundException(`Ride ${id} not found!`);
        }
        return ride.points;
    }

    private haversine(
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number,
    ): number {
        const R = 6371e3;
        const toRad = (deg: number) => (deg * Math.PI) / 180;
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    getTest(): string {
        return "GPX Test";
    }
}
