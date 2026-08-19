import { Component, signal, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RideComponent } from './ride/ride';
import { RideUploadComponent } from "./rideUpload/ride-upload";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RideComponent, RideUploadComponent],
  templateUrl: './app.html',
})
export class App {
  @ViewChild(RideComponent) rideList!: RideComponent;
  
  protected readonly title = signal('frontend');
}
