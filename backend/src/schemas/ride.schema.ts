import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument } from "mongoose";

export type RideDocument = HydratedDocument<Ride>;

@Schema({ _id: false })
export class TrackPoint {
    @Prop()
    @ApiProperty()
    latitude: number;
    
    @Prop()
    @ApiProperty()
    longitude: number;
    
    @Prop()
    @ApiProperty()
    elevation: number;
    
    @Prop()
    @ApiProperty({ required: false })
    time?: Date;
}

export const TrackPointSchema = SchemaFactory.createForClass(TrackPoint);

@Schema()
export class Ride {
    @Prop()
    name: string;

    @Prop()
    date: Date;

    @Prop()
    distance: number;
    
    @Prop()
    elevation: number;
    
    @Prop()
    avgSpeed: number;

    @Prop({ type: [TrackPointSchema] })
    points: TrackPoint[]

    @Prop()
    rawGpx: string;
}

export const RideSchema = SchemaFactory.createForClass(Ride);
