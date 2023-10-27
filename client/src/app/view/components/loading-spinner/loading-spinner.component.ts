import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-loading-spinner",
  templateUrl: "./loading-spinner.component.html",
  styleUrls: ["./loading-spinner.component.scss"],
})
export class LoadingSpinnerComponent {
  /**
   * isLoading: defines the current state of the loading-spinner
   * minHeight: defines the minimum height that should be created to display the loading-spinner
   */
  @Input() isLoading: boolean = false;
  @Input() minHeight: string = "250";
}
