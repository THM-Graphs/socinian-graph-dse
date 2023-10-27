import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { IProjectText } from "src/app/models/IProjectText";
import { ProjectService } from "src/app/services/project.service";
import { LangManager, Languages } from "src/utils/LangManager";

const PUBLISHED_SECTION: string = "ed_f13a5020-2370-4d65-917c-325ca9e77f31";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  public lang = LangManager;
  public language: typeof Languages = Languages;

  public publishedItem: string = PUBLISHED_SECTION;
  public introductionMarkdown: string = "";

  constructor(private router: Router, private projectService: ProjectService) {}

  public async ngOnInit(): Promise<void> {
    this.getIntoductionText();
  }

  public async onSearchEventHandler($event: string): Promise<void> {
    await this.router.navigate(["search", $event]);
  }

  private async getIntoductionText(): Promise<void> {
    const introduction: IProjectText | null = await this.projectService.getProjectText("landing-page");
    if (introduction) this.introductionMarkdown = introduction.text;
  }
}
