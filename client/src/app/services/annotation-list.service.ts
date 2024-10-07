import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IEntity } from '../models/IEntity';
import { getIconByType } from '../const/ICON_MAP';
import { IText } from '../models/IText';
import { AnnotationService } from './annotation.service.js';
import { IStandoffProperty } from '../models/IStandoffProperty';
import { ENTITY_TYPES } from '../const/ENTITY_TYPES';

export interface Annotation {
  type: AnnotationType;
  id: string;
  title: string;
  contents: string;
  standoffProperties?: IStandoffProperty[];
  isLoading: boolean;
}

export enum AnnotationType {
  REGISTER_ENTRY,
  LETTER_ENTRY,
  COMMENT,
  REFERENCE,
}

@Injectable({
  providedIn: 'root',
})
export class AnnotationListService {
  public annotationList: Annotation[] = [];
  public annotationListChange: Subject<Annotation> = new Subject<Annotation>();

  constructor(private standoffPropertyService: AnnotationService) {
    this.annotationListChange.subscribe((annotation: Annotation) => this.annotationList.unshift(annotation));
  }

  public clearList(): void {
    this.annotationList = [];
  }

  public closeAnnotation(id: string): void {
    const annotationIndex: number = this.annotationList.findIndex((a) => a.id === id);
    if (annotationIndex > -1) this.annotationList.splice(annotationIndex, 1);
  }

  public async addEntityAnnotation(standoffPropertyId: string, clickedPhrase: string): Promise<void> {
    const annotation: Annotation = {
      type: AnnotationType.REGISTER_ENTRY,
      id: standoffPropertyId,
      isLoading: true,
    } as Annotation;
    this.annotationListChange.next(annotation);

    const entity: IEntity | null = await this.standoffPropertyService.getEntity(standoffPropertyId);
    if (!entity) return this.closeAnnotation(standoffPropertyId);

    const href: string = `/entry/${entity.guid}`;
    const icon: string = getIconByType(entity.type);

    annotation.title = this.getPhrasedTitle(clickedPhrase, icon, href, entity.label);
    annotation.isLoading = false;
  }

  public async addMetadataAnnotation(standoffPropertyId: string, clickedPhrase: string): Promise<void> {
    const annotation: Annotation = {
      type: AnnotationType.LETTER_ENTRY,
      id: standoffPropertyId,
      isLoading: true,
    } as Annotation;
    this.annotationListChange.next(annotation);

    const text: IText | null = await this.standoffPropertyService.getVariant(standoffPropertyId);
    if (!text || !text.letter) return this.closeAnnotation(standoffPropertyId);

    const href: string = `/view/${text.letter.guid}`;
    const icon: string = getIconByType('text');

    annotation.title = this.getPhrasedTitle(clickedPhrase, icon, href, text.letter.label);
    annotation.isLoading = false;
  }

  public async addReferenceAnnotation(standOffId: string, label: string): Promise<void> {
    const annotation: Annotation = {
      type: AnnotationType.REFERENCE,
      id: standOffId,
      isLoading: true,
    } as Annotation;
    this.annotationListChange.next(annotation);

    const comment: IText | null = await this.standoffPropertyService.getReference(standOffId);
    if (!comment) return this.closeAnnotation(standOffId);

    const href: string = `/view/${comment.letter.guid}`;
    const icon: string = getIconByType(ENTITY_TYPES.word);

    annotation.title = this.getPhrasedTitle(label, icon, href, comment.letter.label);
    annotation.standoffProperties = comment.standoffProperties;

    annotation.contents = comment.text;
    annotation.isLoading = false;
  }

  public async addCommentedAnnotation(standOffId: string, label: string): Promise<void> {
    const annotation: Annotation = {
      type: AnnotationType.COMMENT,
      id: standOffId,
      isLoading: true,
    } as Annotation;
    this.annotationListChange.next(annotation);

    const comment: IText | null = await this.standoffPropertyService.getComment(standOffId);
    if (!comment) return this.closeAnnotation(standOffId);

    annotation.title = `<span class="d-block">» ${label} «</span>`;
    annotation.standoffProperties = comment.standoffProperties;

    annotation.contents = comment.text;
    annotation.isLoading = false;
  }

  private getPhrasedTitle(phrase: string, icon: string, href: string, label: string): string {
    return `<span class="d-block">» ${phrase} «</span>
            <i class="small fas ${icon} d-inline-block me-1"></i>
            <a href="${href}" class="small" target="_blank">${label}</a>`;
  }
}
