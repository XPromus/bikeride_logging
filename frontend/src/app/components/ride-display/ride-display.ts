import { Component, EventEmitter, input, Output } from "@angular/core";
import { RideGetDto } from "../../../types/ride.types";
import { RideMapComponent } from "../ride-map/ride-map";
import { deleteRide } from "../../../api/ride.api";

@Component({
    selector: "ride-display",
    templateUrl: "./ride-display.html",
    imports: [RideMapComponent]
})
export class RideDisplayComponent {
    ride = input.required<RideGetDto | null>();

    @Output() rideDeleted = new EventEmitter<void>();
    async onDeleteRide() {
        const targetRide = this.ride();
        if (targetRide === null) return;
        await deleteRide(targetRide._id);
        this.rideDeleted.emit();
    }

    formatDate(date: string): string {
        return new Date(date).toLocaleDateString();
    }
}
