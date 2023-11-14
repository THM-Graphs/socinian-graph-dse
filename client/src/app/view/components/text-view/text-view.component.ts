import { Component, ElementRef, Input, OnChanges, SimpleChanges } from "@angular/core";
import { IStandoffProperty } from "src/app/models/IStandoffProperty";
import { AnnotationParser } from "../../../../utils/parser/AnnotationParser";
import { AnnotationListService } from "../../../services/annotation-list.service";
import { SelectionUtils } from "src/utils/SelectionUtils";

declare const bootstrap: any;

@Component({
  selector: "app-text-view",
  styleUrls: ["./text-view.component.scss"],
  templateUrl: "./text-view.component.html",
})
export class TextViewComponent implements OnChanges {
  @Input() selectedText: string;
  @Input() standOffProperties: IStandoffProperty[] = [];

  @Input() textId?: string;
  @Input() mouseSelection: boolean = false;

  public parsedText: string = "";

  constructor(private elementRef: ElementRef, private annotationListService: AnnotationListService) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes["selectedText"]) this.initText();
  }

  public initText(): void {
    this.generateStandOffPropertyText();
    setTimeout(() => this.listener(), 500);
  }

  public generateStandOffPropertyText(...standoffProperties: IStandoffProperty[]): void {
    this.parsedText = "";
    const annotationParser: AnnotationParser = new AnnotationParser(this.selectedText, [
      ...this.standOffProperties,
      ...standoffProperties,
    ]);
    this.parsedText = annotationParser.parseText();
  }

  public listener(): void {
    const parent: HTMLElement = this.elementRef.nativeElement;
    const registerElements = parent.querySelectorAll(".register-entry, .custom-entry");
    const abbrElements = parent.querySelectorAll(".abbr");
    const dateElements = parent.querySelectorAll(".date");
    const commentedElements = parent.querySelectorAll(".commented");

    commentedElements.forEach((element: Element) => {
      element.addEventListener("click", this.handleCommentedClick.bind(this));
    });
    registerElements.forEach((element: Element) => {
      element.addEventListener("click", this.handleRegisterClick.bind(this));
    });
    abbrElements.forEach((element: Element) => {
      const abbreviation: string = element.getAttribute("data-abbr") ?? "";
      const abbrTooltipOptions: any = { title: abbreviation, offset: [0, 5] };
      new bootstrap.Tooltip(element, abbrTooltipOptions);
    });
    dateElements.forEach((element: Element) => {
      if (element.getAttribute("data-abbr")) return;
      const date: string = element.getAttribute("data-calendar") ?? "";
      const dateTooltipOptions: any = { title: date, offset: [0, 5] };
      new bootstrap.Tooltip(element, dateTooltipOptions);
    });
  }

  public handleRegisterClick($event: Event): void {
    const element: HTMLElement = $event.target as HTMLElement;
    const type: string = element.getAttribute("data-register-type") ?? "";
    const id: string = element.getAttribute("data-register-id") ?? "";
    if (!id || !type) return;

    const clickedPhrase: string = this.getFullPhrase(element, `data-register-id`);
    switch (type) {
      case "letter":
        this.annotationListService.addMetadataAnnotation(id, clickedPhrase);
        break;
      case "comment":
        this.annotationListService.addReferenceAnnotation(id, clickedPhrase);
        break;
      default:
        this.annotationListService.addEntityAnnotation(id, clickedPhrase);
    }
  }

  public handleSelection(): void {
    if (!this.mouseSelection) return;

    const selection: Selection | null = document.getSelection();
    const selectedText: string | undefined = selection?.toString().trim();
    if (!selection || !selection.anchorNode || !selection.focusNode) return;
    if (!selectedText || selectedText === "") return;

    const isBackwards: boolean = SelectionUtils.isSelectionBackwards(selection);
    const startingNode: Node = isBackwards ? selection.focusNode : selection.anchorNode;
    const offset: number = isBackwards ? selection.focusOffset : selection.anchorOffset;

    const startIndex: number = SelectionUtils.getSelectionStartIndex(startingNode, offset);
    const endIndex: number = startIndex + selectedText.length - 1;

    this.renderSelection(startIndex, endIndex);
  }

  public handleSelectionBox(): void {}

  public handleCommentedClick($event: Event): void {
    const element: HTMLElement = $event.target as HTMLElement;
    const commentedId: string = element.getAttribute("data-comment-id") ?? "";
    if (!commentedId) return;

    const clickedPhrase: string = this.getFullPhrase(element, `data-comment-id`);
    this.annotationListService.addCommentedAnnotation(commentedId, clickedPhrase);
  }

  private getFullPhrase(element: HTMLElement, idAttribute: string): string {
    const id: string = element.getAttribute(idAttribute) ?? "";
    const phrase: string[] = [];
    let cursor: HTMLElement = element.previousElementSibling as HTMLElement;

    while (cursor) {
      if (cursor.getAttribute(idAttribute) !== id) break;
      phrase.unshift(cursor.innerText);
      cursor = cursor.previousElementSibling as HTMLElement;
    }

    phrase.push(element.innerText);
    cursor = element.nextElementSibling as HTMLElement;

    while (cursor) {
      if (cursor.getAttribute(idAttribute) !== id) break;
      phrase.push(cursor.innerText);
      cursor = cursor.nextElementSibling as HTMLElement;
    }

    return phrase.join(" ");
  }

  private renderSelection(startIndex: number, endIndex: number): void {
    const text: string = this.selectedText.substring(startIndex, endIndex);

    const standoffProperty: IStandoffProperty = {
      guid: "selection",
      startIndex: startIndex,
      endIndex: endIndex,
      text: text,
      teiType: "selection",
    } as IStandoffProperty;

    this.generateStandOffPropertyText(standoffProperty);
    setTimeout(() => this.listener(), 500);
  }
}
