import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { ICommunication } from "src/app/models/ICommunication";
import { LangManager } from "src/utils/LangManager";

@Component({
  selector: "app-communications-list",
  templateUrl: "./communications-list.component.html",
  styleUrls: ["./communications-list.component.scss"],
})
export class CommunicationsListComponent implements OnChanges {
  /**
   * communications: a list containing communication entries.
   * currentPage: page starting the communication list.
   * maxAmount: maximum amount of entries per page.
   */
  @Input() communications: ICommunication[] = [];
  @Input() currentPage: number = 1;
  @Input() maxAmount: number = 25;

  public rendered: ICommunication[] = [];
  public availablePages: number[] = [];

  public lang = LangManager;

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes["communications"] || changes["maxAmount"]) {
      this.currentPage = 1;
      this.getAvailablePages();
      this.renderCommunications();
    }
  }

  public renderCommunications(): void {
    const start: number = (this.currentPage - 1) * this.maxAmount;
    const end: number = this.currentPage * this.maxAmount;
    this.rendered = this.communications.slice(start, end);
  }

  private getAvailablePages(): void {
    this.availablePages = new Array(Math.ceil(this.communications.length / this.maxAmount));
  }

  public openInNewTab(guid: string): void {
    window.open(`/view/${guid}`, "_blank");
  }

  public scrollTop(): void {
    const table: HTMLElement | null = document.querySelector(".collection-entries");
    const top: number = table?.offsetTop ? table.offsetTop - 50 : 0;

    window.scroll({
      top,
      left: 0,
      behavior: "smooth",
    });
  }
}
