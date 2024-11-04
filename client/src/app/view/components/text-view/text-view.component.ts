import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { IStandoffProperty } from 'src/app/models/IStandoffProperty';
import { AnnotationParser } from '../../../../utils/parser/AnnotationParser';
import { AnnotationListService } from '../../../services/annotation-list.service';
import { Tooltip } from 'bootstrap';
import { TextViewSelectionUtils } from './text-view.selection-utils';
import { ActivatedRoute, ParamMap } from '@angular/router';

declare const bootstrap: any;

enum ENTITY_TYPE {
  LETTER = 'letter',
  COMMENT = 'comment',
}

interface IEventListener {
  element: Element;
  event: string;
  handler: Function;
}
@Component({
  selector: 'app-text-view',
  styleUrls: ['./text-view.component.scss'],
  templateUrl: './text-view.component.html',
})
export class TextViewComponent implements OnChanges, AfterViewInit {
  @ViewChild('selectionMenu') selectionMenu: ElementRef;

  @Input() text: string = '';
  @Input() guid: string = '';
  @Input() standOffs: IStandoffProperty[] = [];
  @Input() mouseSelection: boolean = false;

  public parsedText: string = '';
  public isSelectionMenuActive: boolean = false;

  private annotations: IStandoffProperty[] = [];
  private selection: IStandoffProperty | undefined;
  private tooltips: Tooltip[] = [];
  private eventListeners: IEventListener[] = [];

  constructor(
    private elementRef: ElementRef,
    private annotationListService: AnnotationListService,
    private route: ActivatedRoute,
  ) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['text']) {
      this.selection = undefined;

      const paramsMap: ParamMap = this.route.snapshot.queryParamMap;
      const selectionStart: number = Number(paramsMap.get('s') ?? 0);
      const selectionEnd: number = Number(paramsMap.get('e') ?? 0);
      const guid: string = paramsMap.get('guid') ?? '';

      const hasSelection: boolean = selectionStart !== selectionEnd;
      if (guid === this.guid && hasSelection) {
        this.setSelection(selectionStart, selectionEnd);
      }

      this.renderText();
    }
  }

  public ngAfterViewInit(): void {
    if (this.selection) {
      const selection: HTMLElement = this.elementRef.nativeElement.querySelector('.selection');
      selection.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }

  public renderText(): void {
    this.disposeEvents();
    this.parsedText = '';

    this.collectAnnotations();
    this.parsedText = this.renderAnnotations();
    setTimeout(() => this.initListeners(), 500);
  }

  private renderAnnotations(): string {
    const annotationParser: AnnotationParser = new AnnotationParser(this.text, [...this.annotations]);
    return annotationParser.parseText();
  }

  private setSelection(startIndex: number, endIndex: number): void {
    const text: string = this.text.substring(startIndex, endIndex);

    this.selection = {
      guid: 'selection',
      startIndex: startIndex,
      endIndex: endIndex,
      text: text,
      teiType: 'selection',
    } as IStandoffProperty;
  }

  private collectAnnotations(): void {
    this.annotations = new Array(...this.standOffs);
    if (this.selection) this.annotations.push(this.selection);
  }

  private disposeEvents(): void {
    this.tooltips.forEach((tooltip: Tooltip) => tooltip.dispose());
    this.tooltips = [];
  }

  private initListeners(): void {
    const parent: HTMLElement = this.elementRef.nativeElement;
    const registerEntries: NodeListOf<HTMLElement> = parent.querySelectorAll('.register-entry, .custom-entry');
    const abbreviations: NodeListOf<HTMLElement> = parent.querySelectorAll('.abbr');
    const dateEntries: NodeListOf<HTMLElement> = parent.querySelectorAll('.date');
    const comments: NodeListOf<HTMLElement> = parent.querySelectorAll('.commented');

    comments.forEach((element: Element) => {
      element.addEventListener('click', this.handleCommentClick.bind(this));
      this.eventListeners.push({ element, event: 'click', handler: this.handleCommentClick.bind(this) });
    });

    registerEntries.forEach((element: Element) => {
      element.addEventListener('click', this.handleRegisterClick.bind(this));
      this.eventListeners.push({ element, event: 'click', handler: this.handleRegisterClick.bind(this) });
    });

    abbreviations.forEach((element: Element) => {
      const abbreviation: string = element.getAttribute('data-abbr') ?? '';
      const abbrTooltipOptions: any = { title: abbreviation, offset: [0, 5] };
      this.tooltips.push(new bootstrap.Tooltip(element, abbrTooltipOptions));
    });

    dateEntries.forEach((element: Element) => {
      if (element.getAttribute('data-abbr')) return;
      const date: string = element.getAttribute('data-calendar') ?? '';
      const dateTooltipOptions: any = { title: date, offset: [0, 5] };
      this.tooltips.push(new bootstrap.Tooltip(element, dateTooltipOptions));
    });
  }

  private displaySelectionMenu(): void {
    const selection: HTMLElement | null = this.elementRef.nativeElement.querySelector('.selection');
    if (!selection) return;

    const offsetTop: number = selection.offsetTop;
    const offsetLeft: number = selection.offsetLeft;

    const element: HTMLElement = this.selectionMenu.nativeElement;
    element.style.top = `${offsetTop}px`;
    element.style.left = `${offsetLeft}px`;
    this.isSelectionMenuActive = true;
  }

  public handleSelection(): void {
    if (!this.mouseSelection) return;

    this.isSelectionMenuActive = false;
    const selection: Selection | null = document.getSelection();
    const selectedText: string | undefined = selection?.toString().trim();

    if (!selection || !selection.anchorNode || !selection.focusNode) return;
    if (!selectedText || selectedText === '') return;

    const isBackwards: boolean = TextViewSelectionUtils.isSelectionBackwards(selection);
    const startingNode: Node = isBackwards ? selection.focusNode : selection.anchorNode;
    const offset: number = isBackwards ? selection.focusOffset : selection.anchorOffset;

    const startIndex: number = TextViewSelectionUtils.getSelectionStartIndex(startingNode, offset);
    const endIndex: number = startIndex + selectedText.length - 1;
    selection.empty();

    this.setSelection(startIndex, endIndex);
    this.renderText();
    setTimeout(() => this.displaySelectionMenu(), 100);
  }

  public async handleCopySelectionURL(): Promise<void> {
    if (!this.guid) return;

    const startIndex: number = this.selection?.startIndex ?? 0;
    const endIndex: number = this.selection?.endIndex ?? 0;

    const currentUrl: string = 'http://localhost:4200';
    const currentPath: string = window.location.pathname.replace('view', 'id');
    const params: string = `?guid=${this.guid}&s=${startIndex}&e=${endIndex}`;
    await navigator.clipboard.writeText(currentUrl + currentPath + params);
  }

  public async handleRegisterClick($event: Event): Promise<void> {
    const element: HTMLElement = $event.target as HTMLElement;
    const type: string = element.getAttribute('data-register-type') ?? '';
    const id: string = element.getAttribute('data-register-id') ?? '';
    if (!id || !type) return;

    const clickedPhrase: string = this.getFullPhrase(element, `data-register-id`);

    switch (type) {
      case ENTITY_TYPE.LETTER:
        await this.annotationListService.addMetadataAnnotation(id, clickedPhrase);
        break;
      case ENTITY_TYPE.COMMENT:
        await this.annotationListService.addReferenceAnnotation(id, clickedPhrase);
        break;
      default:
        await this.annotationListService.addEntityAnnotation(id, clickedPhrase);
    }
  }

  public async handleCommentClick($event: Event): Promise<void> {
    const element: HTMLElement = $event.target as HTMLElement;
    const commentedId: string = element.getAttribute('data-comment-id') ?? '';
    if (!commentedId) return;

    const clickedPhrase: string = this.getFullPhrase(element, `data-comment-id`);
    await this.annotationListService.addCommentedAnnotation(commentedId, clickedPhrase);
  }

  private getFullPhrase(element: HTMLElement, idAttribute: string): string {
    const id: string = element.getAttribute(idAttribute) ?? '';
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

    return phrase.join(' ');
  }
}
