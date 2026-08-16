import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type RideDocument = HydratedDocument<Ride>;

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
}

export const RideSchema = SchemaFactory.createForClass(Ride);
