import { AfterViewChecked, Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { LangManager } from "src/utils/LangManager";

declare const Viewer: any;

@Component({
  selector: "app-image-box",
  templateUrl: "./image-box.component.html",
  styleUrls: ["./image-box.component.scss"],
})
export class ImageBoxComponent implements AfterViewChecked {
  /**
   * src: image source url.
   * alt: alternative image text.
   * text: image subText as overlay.
   */
  @Input() src: string = "";
  @Input() alt: string = "";
  @Input() text: string = "";
  @Input() isLink: boolean = false;

  @ViewChild("image") image: ElementRef<HTMLImageElement>;

  public lang = LangManager;

  public ngAfterViewChecked(): void {
    if (!this.image) return;
    const viewerOptions: any = { toolbar: false, navbar: false };
    new Viewer(this.image.nativeElement, viewerOptions);
  }
}
