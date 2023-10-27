import { Component, OnInit } from "@angular/core";
import { LangManager } from "../../../../utils/LangManager";
import { ICommunication } from "src/app/models/ICommunication";
import { CommunicationService } from "src/app/services/communication.service";

@Component({
  selector: "app-collections",
  templateUrl: "./collection.component.html",
  styleUrls: ["./collection.component.scss"],
})
export class CollectionComponent implements OnInit {
  public isCollectionsLoading: boolean = false;

  public communications: ICommunication[] = [];
  public filteredCommunications: ICommunication[] = [];
  public maxAmount: number = 25;
  public currentPage: number = 1;
  public lang = LangManager;

  constructor(private communicationService: CommunicationService) {}

  public async ngOnInit(): Promise<void> {
    await this.getCommunications();
  }

  public async getCommunications(): Promise<void> {
    this.isCollectionsLoading = true;
    this.communications = await this.communicationService.getCommunications();
    this.filteredCommunications = this.communications;
    this.isCollectionsLoading = false;
  }
}
