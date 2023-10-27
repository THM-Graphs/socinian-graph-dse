import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ISection } from "src/app/models/ISection";
import { SectionService } from "src/app/services/section.service";
import { LangManager } from "src/utils/LangManager";

export interface SectionListing {
  name: string;
  href: string;
}

@Component({
  selector: "app-section-list",
  templateUrl: "./section-list.component.html",
  styleUrls: ["./section-list.component.scss"],
})
export class SectionListComponent implements OnInit {
  /**
   * title: Box title to use.
   * sectionId: If provided, returns children of a section.
   * hideEmpty: Hides sections with empty childrens.
   * callback: Defines what to do if a listing has been clicked.
   */
  @Input() title: string = "";
  @Input() sectionId?: string;
  @Input() hideEmpty?: boolean = false;
  @Input() callback: (listing: SectionListing) => void = this.defaultCallback.bind(this);

  public isSectionListLoading: boolean = false;
  public sectionListing: SectionListing[] = [];
  public lang = LangManager;

  constructor(private sectionService: SectionService, private router: Router) {}

  public async ngOnInit(): Promise<void> {
    const sectionList: ISection[] = await this.getSectionList();
    sectionList.sort((a: ISection, b: ISection) => a.label?.localeCompare(b.label));
    this.prepareSectionListing(sectionList);
  }

  private async getSectionList(): Promise<ISection[]> {
    this.isSectionListLoading = true;
    const sectionList: ISection[] = [];

    if (this.sectionId) {
      const children: ISection[] = await this.sectionService.getChildrenList(this.sectionId);
      sectionList.push(...children);
    } else {
      sectionList.push(...(await this.sectionService.getSectionList()));
    }

    this.isSectionListLoading = false;
    return sectionList;
  }

  private prepareSectionListing(sectionList: ISection[]): void {
    for (const section of sectionList) {
      if (section.guid === "unordered") continue;
      if (this.hideEmpty && section.children?.length === 0) continue;

      this.sectionListing.push({
        name: section.label,
        href: `/section/${section.guid}`,
      });
    }
  }

  private defaultCallback(listing: SectionListing): void {
    this.router.navigate([listing.href]);
  }
}
