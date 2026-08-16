import { Module } from "@nestjs/common";
import { GpxController } from "./gpx.controller";
import { GpxService } from "./gpx.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Ride, RideSchema } from "src/schemas/ride.schema";

@Module({
    imports: [MongooseModule.forFeature([{ name: Ride.name, schema: RideSchema }])],
    controllers: [GpxController],
    providers: [GpxService],
})
export class GpxModule {}
