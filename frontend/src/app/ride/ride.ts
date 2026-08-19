import { Component, OnInit, signal } from "@angular/core";
import { getRides } from "../../api/ride.api";
import { RideGetDto } from "../../types/ride.types";

@Component({
    selector: "ride",
    templateUrl: './ride.html'
})
export class RideComponent implements OnInit {
    rides = signal<RideGetDto[]>([]);
    loading = signal(true);
    error = signal<string | null>(null);

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
