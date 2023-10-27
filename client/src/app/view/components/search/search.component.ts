import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { LangManager } from "../../../../utils/LangManager";
import { ISearchLetterEntry, ISearchEntity, ISearch } from "../../../models/ISearch";
import { Utils } from "../../../../utils/Utils";
import { SearchService } from "../../../services/search.service";
import { getIconByType, ICON_MAP } from "src/app/const/ICON_MAP";

export interface SearchResult {
  result: string;
  details?: string;
  icon: string;
  href: string;
}

const MAXIMUM_REGISTER_RESULTS = 3;
const MAXIMUM_TEXT_RESULTS = 5;

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
})
export class SearchComponent implements OnInit {
  @Output() onSearch: EventEmitter<string> = new EventEmitter();
  @Output() onInput: EventEmitter<string> = new EventEmitter();
  @Input() isSuggestionEnabled: boolean = false;
  @Input() inputSearchString: string = "";

  public lang = LangManager;
  public searchResults: SearchResult[] = [];
  public isSearchResultLoading: boolean = false;

  public availableSearchResults: number = 0;
  public searchString: string = "";

  private searchTimer: any;

  constructor(private simpleSearchService: SearchService) {}

  public async ngOnInit(): Promise<void> {
    this.searchString = this.inputSearchString;

    if (this.isSuggestionEnabled) {
      await this.simpleSearch();
    }
  }

  public async handleOnSearch(): Promise<void> {
    this.onSearch.emit(this.searchString);
  }

  public async handleOnInput($event: Event): Promise<void> {
    const targetElement: HTMLInputElement = ($event as InputEvent).target as HTMLInputElement;
    this.searchString = targetElement.value;
    this.searchResults = [];
    this.availableSearchResults = 0;

    if (this.searchString === "" || this.searchString.length < 3) return;
    this.onInput.emit(this.searchString);
    if (!this.isSuggestionEnabled) return;

    this.isSearchResultLoading = true;
    clearTimeout(this.searchTimer);

    this.searchTimer = setTimeout(async () => {
      if (this.searchString === "") {
        this.isSearchResultLoading = false;
        return;
      }

      await this.simpleSearch();
      this.isSearchResultLoading = false;
    }, 1000);
  }

  private async simpleSearch(): Promise<void> {
    const result: ISearch = await this.simpleSearchService.getSimpleSearchResults(this.searchString);
    const registerResults: ISearchEntity[] = result?.entities.slice(0, MAXIMUM_REGISTER_RESULTS) ?? [];
    const textResults: ISearchLetterEntry[] = result?.letters?.slice(0, MAXIMUM_TEXT_RESULTS) ?? [];

    if (registerResults.length > 0 || textResults.length > 0) {
      this.availableSearchResults = result.letters.length + result.entities.length;
    }

    this.searchResults.push(
      ...registerResults.map((register: ISearchEntity) => {
        return {
          result: register.label,
          href: `/register/${register.type}/${register.guid}`,
          icon: getIconByType(register.type),
        };
      })
    );

    this.searchResults.push(
      ...textResults.map((letter: ISearchLetterEntry) => {
        const searchArray: string[] = Utils.matchWordsAndQuotes(this.searchString);

        const detailedOccurrence = letter.occurrences.map((occurrence: string) => {
          for (const searchString of searchArray) {
            const index = occurrence.toLocaleLowerCase().indexOf(searchString.toLocaleLowerCase());
            occurrence =
              occurrence.slice(0, index) +
              "<b>" +
              occurrence.slice(index, index + searchString.length) +
              "</b>" +
              occurrence.slice(index + searchString.length);
          }
          return occurrence;
        });

        return {
          result: letter.label,
          href: `/view/${letter.guid}`,
          icon: ICON_MAP.text.icon,
          details: detailedOccurrence ? `... ${detailedOccurrence[0]} ...` : "",
        };
      })
    );
  }
}
