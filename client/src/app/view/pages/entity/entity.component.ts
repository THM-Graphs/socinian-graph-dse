import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IEntity } from 'src/app/models/IEntity';
import { INormdata } from 'src/app/models/INormdata';
import { EntityService } from 'src/app/services/entity.service';
import { LangManager } from 'src/utils/LangManager';
import { Nullable } from '../../../../global.js';

@Component({
  selector: 'app-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.scss'],
})
export class EntityComponent implements OnInit {
  public isLoading: boolean = false;
  public entity: IEntity;
  public data: any;

  public additionalFields: { label: string; value: string }[] = [];
  public lang = LangManager;

  constructor(
    private entityService: EntityService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {}

  public async ngOnInit(): Promise<void | boolean> {
    const entityId: string | null = this.activatedRoute.snapshot.paramMap.get('guid');
    if (!entityId) return this.router.navigate(['/register']);
    await this.loadEntity(entityId);
    this.getAdditionalFields();
  }

  public onOpenNormdata(normdata: INormdata): void {
    window.open(normdata.prefix + normdata.guid);
  }

  public onOpenInfoWebsite(info: string): void {
    const website: { url: string } = this.parseInfoWebsite(info);
    window.open(website.url);
  }

  public parseInfoWebsite(info: string): { url: string } {
    return JSON.parse(info);
  }

  private async loadEntity(entityId: string): Promise<void | boolean> {
    this.isLoading = true;
    const entity: Nullable<IEntity> = await this.entityService.getEntity(entityId);
    if (!entity) return this.router.navigate(['/register']);
    this.entity = entity;
    this.data = JSON.parse(entity.data);
    this.isLoading = false;
  }

  private getAdditionalFields(): void {
    if (this.data?.birth) this.additionalFields.push({ label: 'ENTITY_PAGE_FIELDS_BIRTH', value: this.data.birth });
    if (this.data?.death) this.additionalFields.push({ label: 'ENTITY_PAGE_FIELDS_DEATH', value: this.data.death });
  }
}
