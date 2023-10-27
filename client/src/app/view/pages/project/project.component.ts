import { Location } from "@angular/common";
import { Component } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { IProjectText } from "src/app/models/IProjectText";
import { ProjectService } from "src/app/services/project.service";
import { LangManager } from "src/utils/LangManager";

@Component({
  selector: "app-project",
  templateUrl: "./project.component.html",
  styleUrls: ["./project.component.scss"],
})
export class ProjectComponent {
  public isTextLoading: boolean = false;
  public selectedText: IProjectText = { guid: "", label: "", text: "" };
  public lang = LangManager;

  public categories: { label: string; guid: string; icon: string }[] = [
    {
      label: "PROJECT_CATEGORY_INTRODUCTION",
      guid: "introduction",
      icon: "fa-book",
    },
    {
      label: "PROJECT_CATEGORY_COWORKERS",
      guid: "staff",
      icon: "fa-user",
    },
    {
      label: "PROJECT_CATEGORY_PARTNERS",
      guid: "collaborators",
      icon: "fa-handshake",
    },
    {
      label: "PROJECT_CATEGORY_GUIDELINES",
      guid: "guidelines",
      icon: "fa-info-circle",
    },
    {
      label: "PROJECT_CATEGORY_METHODOLOGIES",
      guid: "digital-methods",
      icon: "fa-project-diagram",
    },
    {
      label: "PROJECT_CATEGORY_TEXT_COMPARE",
      guid: "text-collations",
      icon: "fa-underline",
    },
  ];

  constructor(
    private projectService: ProjectService,
    private location: Location,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.params.subscribe((params: Params) => {
      const selectedCategory: string = params.category ?? "introduction";
      this.onSelectProjectCategory(selectedCategory);
    });
  }

  public async onSelectProjectCategory(guid: string): Promise<void> {
    this.isTextLoading = true;
    const projectText: IProjectText | null = await this.projectService.getProjectText(guid);
    if (projectText) this.selectedText = projectText;
    this.location.go(`/project/${this.selectedText.guid}`);
    this.scrollTop();
    this.isTextLoading = false;
  }

  private scrollTop(): void {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }
}
