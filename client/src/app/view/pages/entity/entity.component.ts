import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IEntity } from 'src/app/models/IEntity';
import { INormdata } from 'src/app/models/INormdata';
import { EntityService } from 'src/app/services/entity.service';
import { LangManager } from 'src/utils/LangManager';
import { Nullable } from '../../../../global';
import { IMetadata } from '../../../models/IMetadata';
import { getIconByCategory } from '../../../constants/ICON_MAP';
import { getTranslationByCategory } from '../../../constants/ENTITY_CATEGORY';

interface Occurrence extends IMetadata {
  occurrences: number;
}

interface AdditionalFields {
  birth: Nullable<string>;
  death: Nullable<string>;
}

@Component({
  selector: 'app-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.scss'],
})
export class EntityComponent implements OnInit {
  public isLoading: boolean = false;
  public isMentionsOpen: boolean = true;
  public isRemarksOpen: boolean = true;
  public isNormdataCopied: string[] = [];
  public isEntityLinkCopied: boolean = false;

  public currentEntity: IEntity;
  public currentIcon: string = '';
  public currentType: string = '';
  public additionalData: Nullable<AdditionalFields>;

  public additionalFields: { label: string; value: string }[] = [];
  public remarkedBy: Occurrence[] = [];
  public mentionedBy: Occurrence[] = [];

  public lang = LangManager;

  constructor(
    private entityService: EntityService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {}

  public async ngOnInit(): Promise<void | boolean> {
    const entityId: string | null = this.activatedRoute.snapshot.paramMap.get('guid');
    if (!entityId) return this.router.navigate(['/register']);

    this.isLoading = true;

    await this.retrieveEntity(entityId);
    this.computeOccurrences();
    this.computeAdditionalFields();

    this.isLoading = false;
  }

  public onOpenNormdata(normdata: INormdata): void {
    window.open(normdata.prefix + normdata.guid, '_blank');
  }

  public async onCopyNormdata(normdata: INormdata): Promise<void> {
    await navigator.clipboard.writeText(normdata.guid);
    this.isNormdataCopied.push(normdata.guid);

    setTimeout(() => {
      const indexOf: number = this.isNormdataCopied.indexOf(normdata.guid);
      this.isNormdataCopied.splice(indexOf, 1);
    }, 2000);
  }

  public async onCopyEntityLink(): Promise<void> {
    await navigator.clipboard.writeText(`https://www.sozinianer.de/entity/${this.currentEntity.guid}`);
    this.isEntityLinkCopied = true;

    setTimeout(() => {
      this.isEntityLinkCopied = false;
    }, 2000);
  }

  public onOpenAdditionalWebsite(info: string): void {
    const website: { url: string } = this.parseAdditionalWebsite(info);
    window.open(website.url, '_blank');
  }

  public onOpenLetter(guid: string): void {
    window.open(`/id/${guid}`, '_blank');
  }

  public parseAdditionalWebsite(field: string): { url: string } {
    return JSON.parse(field);
  }

  private async retrieveEntity(entityId: string): Promise<void | boolean> {
    const entity: Nullable<IEntity> = await this.entityService.getEntity(entityId);
    if (!entity) return this.router.navigate(['/register']);

    this.currentEntity = entity;
    this.currentIcon = getIconByCategory(entity.type);
    this.currentType = getTranslationByCategory(entity.type);
    if (entity.data) this.additionalData = JSON.parse(entity.data);
  }

  private computeOccurrences(): void {
    this.mentionedBy = this.mergeOccurrences(this.currentEntity.mentionedBy);
    this.mentionedBy.sort((a, b) => b.occurrences - a.occurrences);

    this.remarkedBy = this.mergeOccurrences(this.currentEntity.remarkedBy);
    this.remarkedBy.sort((a, b) => b.occurrences - a.occurrences);
  }

  private mergeOccurrences(array: IMetadata[]): Occurrence[] {
    return array.reduce((acc: Occurrence[], next: IMetadata): Occurrence[] => {
      const existing: Nullable<Occurrence> = acc.find((o: Occurrence): boolean => o.guid === next.guid);
      if (!existing) acc.push({ ...next, occurrences: 1 });
      else existing.occurrences = existing.occurrences + 1;
      return acc;
    }, []);
  }

  private computeAdditionalFields(): void {
    if (this.additionalData?.birth) {
      this.additionalFields.push({ label: 'ENTITY_PAGE_FIELDS_BIRTH', value: this.additionalData.birth });
    }

    if (this.additionalData?.death) {
      this.additionalFields.push({ label: 'ENTITY_PAGE_FIELDS_DEATH', value: this.additionalData.death });
    }
  }
}
