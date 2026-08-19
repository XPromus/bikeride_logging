import { isPlatformBrowser } from "@angular/common";
import { AfterViewInit, Component, effect, inject, input, OnDestroy, PLATFORM_ID } from "@angular/core";
import * as L from "leaflet";
import { getRidePoints } from "../../../api/ride.api";
import { TrackPoint } from "../../../types/ride.types";

@Component({
    selector: "ride-map",
    templateUrl: "./ride-map.html",
    styleUrl: "./ride-map.css"
})
export class RideMapComponent implements AfterViewInit, OnDestroy {
    private platformId = inject(PLATFORM_ID);
    private map: L.Map | null = null;
    private mapReady = false;

    rideId = input.required<string>();

    constructor() {
        effect(() => {
            const id = this.rideId();
            if (this.mapReady) {
                this.loadRoute(id);
            }
        })
    }

    ngAfterViewInit(): void {
        if (!isPlatformBrowser(this.platformId)) return;

        const container = document.getElementById("ride-map");
        if (!container) return;

        this.map = L.map(container).setView([50.0, 10.0], 6);
        L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
            attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
            maxZoom: 19,
        }).addTo(this.map);

        this.mapReady = true;
        this.loadRoute(this.rideId());
    }

    ngOnDestroy(): void {
        this.map?.remove();
        this.map = null;
    }

    private async loadRoute(
        id: string
    ) {
        if (!this.map) return;

        try {
            const points: TrackPoint[] = await getRidePoints(id);
            if (!points.length || !this.map) return;

            const coords: L.LatLngExpression[] = points.map(p => [p.latitude, p.longitude]);
            const polyline = L.polyline(coords, { color: "#818CF8", weight: 3 }).addTo(this.map);
            this.map.fitBounds(polyline.getBounds(), { padding: [20, 20] });
        } catch (e) {
            console.error("Failed to load route", e);
        }
    }
}
