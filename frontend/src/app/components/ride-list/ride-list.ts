import { Component, EventEmitter, OnInit, Output, signal } from "@angular/core";
import { getRides } from "../../../api/ride.api";
import { RideGetDto } from "../../../types/ride.types";

@Component({
    selector: "ride-list",
    templateUrl: './ride-list.html'
})
export class RideListComponent implements OnInit {
    rides = signal<RideGetDto[]>([]);
    loading = signal(true);
    error = signal<string | null>(null);

    @Output() rideSelected = new EventEmitter<RideGetDto>();
    selectedRide = signal<RideGetDto | null>(null);

    onRideClick(ride: RideGetDto) {
        this.rideSelected.emit(ride);
        this.selectedRide.set(ride);
    }

    formatDate(date: string): string {
        return new Date(date).toLocaleDateString();
    }

    async loadRides() {
        this.loading.set(true);
        this.error.set(null);

        try {
            const data = await getRides();
            this.rides.set(data);
        } catch (e) {
            this.error.set("Failed to load rides");
        } finally {
            this.loading.set(false)
        }
    }

    async ngOnInit() {
        await this.loadRides();
    }
}
