import { OmitType } from "@nestjs/swagger";
import { Ride } from "./ride.schema";

export class RideGetDto extends OmitType(Ride, ["rawGpx", "points"] as const) {};
