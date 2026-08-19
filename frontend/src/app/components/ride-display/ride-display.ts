import { Component, input } from "@angular/core";
import { RideGetDto } from "../../../types/ride.types";
import { RideMapComponent } from "../ride-map/ride-map";

@Component({
    selector: "ride-display",
    templateUrl: "./ride-display.html",
    imports: [RideMapComponent]
})
export class RideDisplayComponent {
    ride = input.required<RideGetDto | null>();

    onDeleteRide() {
        
    }

    formatDate(date: string): string {
        return new Date(date).toLocaleDateString();
    }
}
