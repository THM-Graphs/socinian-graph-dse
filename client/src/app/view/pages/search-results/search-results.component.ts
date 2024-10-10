import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../../services/search.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ISearch, ISearchEntity, ISearchLetterEntry } from '../../../models/ISearch';
import { LangManager } from '../../../../utils/LangManager';
import { Utils } from '../../../../utils/Utils';
import { LocalStorage } from '../../../../utils/LocalStorage';
import { getIconByType } from 'src/app/const/ICON_MAP';

interface SearchDetailsTab<T> {
  key: number;
  singularTitle: string;
  pluralTitle: string;
  values: T[];
}

interface SimpleSearchRegisterTabEntry {
  href: string;
  icon: string;
  label: string;
}

interface SearchDetailsTabMenu {
  letters: SearchDetailsTab<ISearchLetterEntry>;
  register: SearchDetailsTab<SimpleSearchRegisterTabEntry>;
}

enum Tabs {
  letters,
  register,
}

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent implements OnInit {
  public lang = LangManager;
  public isSearching: boolean = false;

  public letterStorage: LocalStorage = new LocalStorage('letter');
  public storedLetters: ISearchLetterEntry[] = [];

  public tabMenu: SearchDetailsTabMenu = {
    letters: {
      key: Tabs.letters,
      singularTitle: 'SEARCH_DETAILS_RESULT_LETTERS_SINGULAR_TITLE',
      pluralTitle: 'SEARCH_DETAILS_RESULT_LETTERS_PLURAL_TITLE',
      values: [],
    },
    register: {
      key: Tabs.register,
      singularTitle: 'SEARCH_DETAILS_RESULT_REGISTER_SINGULAR_TITLE',
      pluralTitle: 'SEARCH_DETAILS_RESULT_REGISTER_PLURAL_TITLE',
      values: [],
    },
  };
  public currentSelectedTab: Tabs = Tabs.letters;
  public tabs: typeof Tabs = Tabs;

  public searchResultAmount: number = 0;
  public searchPhrase: string = '';

  private searchTimer: any;
  private simpleSearchResults: ISearch;

  constructor(
    private simpleSearchService: SearchService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {}

  public async ngOnInit(): Promise<void> {
    this.searchPhrase = this.activatedRoute.snapshot.paramMap.get('searchPhrase') ?? '';

    if (this.letterStorage.getItems()?.length > 0) {
      this.storedLetters = this.letterStorage.getItems();
    }

    if (!this.searchPhrase || this.searchPhrase.length < 3) {
      await this.router.navigate(['/']);
    }

    await this.simpleSearch();
  }

  public async onInputEventHandler($event: string): Promise<void> {
    this.searchPhrase = $event;
    await this.router.navigate(['/search/' + this.searchPhrase]);
    clearTimeout(this.searchTimer);

    this.searchTimer = setTimeout(async () => {
      if (this.searchPhrase === '') {
        this.isSearching = false;
        return;
      }

      await this.simpleSearch();
      this.isSearching = false;
    }, 1000);
  }

  public rememberLetter(letter: ISearchLetterEntry): void {
    this.storedLetters.push(letter);
    this.letterStorage.setItems(this.storedLetters);
  }

  public removeLetter(letter: ISearchLetterEntry): void {
    const letterIndex: number = this.storedLetters.findIndex((l: ISearchLetterEntry) => l.guid === letter.guid);
    this.storedLetters.splice(letterIndex, 1);
    this.letterStorage.setItems(this.storedLetters);
  }

  public isInLetterStorage(letter: ISearchLetterEntry): boolean {
    return this.storedLetters.findIndex((l: ISearchLetterEntry) => l.guid === letter.guid) >= 0;
  }

  private async simpleSearch(): Promise<void> {
    this.isSearching = true;
    this.simpleSearchResults = (await this.simpleSearchService.getSimpleSearchResults(this.searchPhrase))!;

    this.tabMenu.letters.values = [
      ...this.simpleSearchResults.letters.map((letter: ISearchLetterEntry) => {
        const searchArray: string[] = Utils.matchWordsAndQuotes(this.searchPhrase);

        const occurrences = letter.occurrences.map((o: string) => {
          for (const searchString of searchArray) {
            const index = o.toLocaleLowerCase().indexOf(searchString.toLocaleLowerCase());
            o =
              o.slice(0, index) +
              '<b>' +
              o.slice(index, index + searchString.length) +
              '</b>' +
              o.slice(index + searchString.length);
          }
          return `&raquo; ...${o}... &laquo;`;
        });

        return { guid: letter.guid, label: letter.label, occurrences };
      }),
    ];

    this.tabMenu.register.values = [
      ...this.simpleSearchResults.entities.map((register: ISearchEntity) => {
        return {
          label: register.label,
          href: `/register/${register.type}/${register.guid}`,
          icon: getIconByType(register.type),
        };
      }),
    ];

    for (const [_, tabMenu] of Object.entries(this.tabMenu)) {
      if (tabMenu.values.length < 1) continue;
      this.currentSelectedTab = tabMenu.key;
      break;
    }

    this.searchResultAmount = this.tabMenu.letters.values.length + this.tabMenu.register.values.length;
    this.isSearching = false;
  }
}
