import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ICommunication } from "src/app/models/ICommunication";
import { ISection } from "src/app/models/ISection";
import { SectionService } from "src/app/services/section.service";
import { LangManager } from "src/utils/LangManager";
import { Utils } from "src/utils/Utils";

const PUBLISHED_SECTION: string = "ed_f13a5020-2370-4d65-917c-325ca9e77f31";

@Component({
  selector: "app-section",
  templateUrl: "./section.component.html",
  styleUrls: ["./section.component.scss"],
})
export class SectionComponent implements OnInit {
  public selectedSection: ISection;
  public filteredCommunications: ICommunication[];

  public isTextFullyOpened: boolean = false;
  public isSectionLoading: boolean = false;
  public isSectionInnerLoading: boolean = false;

  public sections: ISection[] = [];
  public lang = LangManager;

  constructor(
    private sectionService: SectionService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  public async ngOnInit(): Promise<void> {
    const sectionId: string = this.activatedRoute.snapshot.paramMap.get("section") ?? PUBLISHED_SECTION;
    await this.renderSectionList();
    this.renderSection(sectionId);
  }

  public async renderSectionList(): Promise<void> {
    const alphabeticalSort = (a: ISection, b: ISection) => a.label?.localeCompare(b.label);
    this.isSectionLoading = true;

    this.sections = Utils.deepClone(await this.sectionService.getSectionList());
    this.sections.forEach((s: ISection) => s.children.sort(alphabeticalSort));
    this.sections.sort(alphabeticalSort);
    this.isSectionLoading = false;
  }

  public async renderSection(sectionId: string): Promise<void | boolean> {
    this.scrollTop();
    this.isTextFullyOpened = false;
    this.location.go(`/section/${sectionId}`);

    const selectedSection: ISection | undefined = this.sections.find((s: ISection) => s.guid === sectionId);
    const isListed: boolean = this.isSectionListed(sectionId);
    if (!isListed) return this.router.navigate(["/section/"]);

    if (selectedSection) this.selectedSection = selectedSection;
    else {
      this.isSectionInnerLoading = true;
      this.selectedSection = (await this.sectionService.getSection(sectionId)) as ISection;
      this.isSectionInnerLoading = false;
    }

    this.filteredCommunications = this.selectedSection.communications;
  }

  public isSectionListed(sectionId: string): boolean {
    const isParent: boolean = !!this.sections.find((s: ISection) => s.guid === sectionId);
    const isChild: boolean = !!this.sections.find((s: ISection) =>
      s.children.find((c: ISection) => c.guid === sectionId)
    );

    return isParent || isChild;
  }

  public isSectionTreeSelected(section: ISection): boolean {
    if (section.guid === this.selectedSection.guid) return true;
    const isChild: boolean = !!section.children.find((c: ISection) => c.guid === this.selectedSection.guid);
    return isChild;
  }

  private scrollTop(): void {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }
}
