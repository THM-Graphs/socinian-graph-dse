import { Component, OnInit } from '@angular/core';
import { LangManager } from '../../../../utils/LangManager';
import { ENTITY_CATEGORY } from '../../../constants/ENTITY_CATEGORY';
import { EntityService } from '../../../services/entity.service';
import * as removeAccents from 'remove-accents';
import { IEntity } from 'src/app/models/IEntity';

interface RegisterCategory {
  name: string;
  type: ENTITY_CATEGORY | string;
  icon: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  public activeRegister: string;

  public registerEntries: IEntity[] = [];
  public filteredEntries: IEntity[] = [];

  public activeLetter: string;
  public availableLetters: string[] = [];

  public searchPhrase: string = '';
  public isRegisterLoading: boolean = false;

  public lang = LangManager;
  public categories: RegisterCategory[] = [
    {
      name: 'REGISTER_HUMAN_INDEX',
      type: ENTITY_CATEGORY.PERSON,
      icon: 'fa-person',
    },
    {
      name: 'REGISTER_PLACE_INDEX',
      type: ENTITY_CATEGORY.PLACE,
      icon: 'fa-map',
    },
    {
      name: 'REGISTER_WORD_INDEX',
      type: ENTITY_CATEGORY.WORD,
      icon: 'fa-quote-left',
    },
    {
      name: 'REGISTER_BIBLE_VERSE_INDEX',
      type: ENTITY_CATEGORY.BIBLE_VERSE,
      icon: 'fa-align-center',
    },
  ];

  constructor(private registerService: EntityService) {}

  public async ngOnInit(): Promise<void> {
    let register: RegisterCategory = this.categories[0];
    this.onRegisterSelected(register);
  }

  public async onRegisterSelected(register?: RegisterCategory): Promise<void> {
    this.scrollTop();
    this.isRegisterLoading = true;

    if (!register) {
      this.activeRegister = 'REGISTER_ALL_REGISTER';
      await this.loadAllRegisterEntries();
    } else {
      this.activeRegister = register.name;
      await this.loadRegisterEntries(register.type);
    }

    this.generateLetters();
    this.onFilterEntriesByLetter(this.activeLetter);
    if (this.searchPhrase !== '') this.onFilterEntriesBySearch();
    this.isRegisterLoading = false;
  }

  public onSearchInputEvent($event: Event): void {
    this.scrollTop();
    const targetElement: HTMLInputElement = ($event as InputEvent).target as HTMLInputElement;
    this.searchPhrase = removeAccents(targetElement.value)?.toLocaleLowerCase() ?? '';
    this.onFilterEntriesBySearch();
  }

  public onFilterEntriesBySearch(): void {
    this.filteredEntries = this.registerEntries.filter((entry: IEntity) =>
      removeAccents(entry.label).toLocaleLowerCase().includes(this.searchPhrase),
    );
    this.filteredEntries.sort((a, b) => a.label.localeCompare(b.label));
  }

  public onFilterEntriesByLetter(letter: string): void {
    this.scrollTop();
    this.filteredEntries = this.registerEntries.filter((entry: IEntity) => {
      return removeAccents(entry.label).toLocaleLowerCase().startsWith(letter.toLowerCase());
    });
    this.filteredEntries.sort((a, b) => a.label.localeCompare(b.label));
  }

  private async loadAllRegisterEntries(): Promise<void> {
    this.registerEntries = [];
    for (const category of this.categories) {
      const entries: IEntity[] = await this.registerService.getEntities(category.type);
      this.registerEntries.push(...entries);
    }
  }

  private async loadRegisterEntries(type: ENTITY_CATEGORY | string): Promise<void> {
    this.registerEntries = await this.registerService.getEntities(type);
  }

  private generateLetters(): void {
    this.availableLetters = [];

    this.registerEntries.forEach((entry: IEntity) => {
      const firstLetter: string = removeAccents(entry.label.slice(0, 1).toLocaleLowerCase());
      if (!this.availableLetters.includes(firstLetter)) {
        this.availableLetters.push(firstLetter);
      }
    });

    this.availableLetters.sort((a, b) => a.localeCompare(b));
    this.activeLetter = this.availableLetters[0] ?? '';
  }

  private scrollTop(): void {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
}
