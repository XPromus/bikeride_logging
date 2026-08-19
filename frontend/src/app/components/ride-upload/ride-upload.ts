import { Component, EventEmitter, Output, signal } from "@angular/core";
import { RideGetDto } from "../../../types/ride.types";
import { uploadRide } from "../../../api/ride.api";

@Component({
    selector: "ride-upload",
    templateUrl: "./ride-upload.html",
})
export class RideUploadComponent {
    @Output() rideUploaded = new EventEmitter<void>();

    selectedFile = signal<File | null>(null);

    uploading = signal(false);
    uploadedRide = signal<RideGetDto | null>(null);
    error = signal<string | null>(null);

    async onFileUpload() {
        const file = this.selectedFile();
        if (!file) return;

        this.uploading.set(true);
        this.error.set(null);
        this.uploadedRide.set(null);

        try {
            const ride = await uploadRide(file);
            this.uploadedRide.set(ride);
            this.rideUploaded.emit();
        } catch (e) {
            this.error.set("Upload failed");
        } finally {
            this.uploading.set(false);
        }
    }

    async onFileSelected(
        event: Event
    ) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;

        this.selectedFile.set(file);
    }
}
