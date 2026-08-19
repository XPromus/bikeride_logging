import { Component, signal, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RideListComponent } from './components/ride-list/ride-list';
import { RideUploadComponent } from "./components/ride-upload/ride-upload";
import { RideGetDto } from '../types/ride.types';
import { RideDisplayComponent } from "./components/ride-display/ride-display";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RideListComponent, RideUploadComponent, RideDisplayComponent],
  templateUrl: './app.html',
})
export class App {
  @ViewChild(RideListComponent) rideList!: RideListComponent;

  selectedRide = signal<RideGetDto | null>(null);

  protected readonly title = signal('frontend');
}
