import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ICommunication } from 'src/app/models/ICommunication';
import { LangManager } from 'src/utils/LangManager';
import * as removeAccents from 'remove-accents';
import { TRANSCRIPTION_STATUS } from '../../../constants/TRANSCRIPTION_STATUS';

enum SortOptions {
  startAlpha = 'COLLECTION_SORT_ALPHABETICAL_START',
  endAlpha = 'COLLECTION_SORT_ALPHABETICAL_END',
  variants = 'COLLECTION_SORT_VARIANTS',
  attachments = 'COLLECTION_SORT_ATTACHMENTS',
  date = 'COLLECTION_SORT_DATE',
}

enum StatusOptions {
  metadata = 'STATUS_PIPE_METADATA',
  transcription = 'STATUS_PIPE_TRANSCRIPTION',
  conclusion = 'STATUS_PIPE_FULL_CONCLUSION',
  nostatus = 'COLLECTION_STATUS_DEFAULT',
}

@Component({
  selector: 'app-communications-filter',
  templateUrl: './communications-filter.component.html',
  styleUrls: ['./communications-filter.component.scss'],
})
export class CommunicationsFilterComponent implements OnChanges {
  /**
   * communications: a list containing all communications to work with in this component.
   * maxAmount: contains a default value for the maxAmount list.
   * sortOption: contains the default sortOption.
   * statusOption: contains the default statusOption.
   *
   * showMaxAmount: shows the max amount interface
   * showSortOptions: shows the sort options interface
   * showStatusOptions: shows the status options interface
   * showSearch: shows the search bar interface
   *
   * O:filteredCommunicationEvent: event that will be emitted whenever the communications have been sorted/filtered.
   * O:maxAmountEvent: event that will be emitted whenever the maxAmount value has been changed.
   */
  @Input() communications: ICommunication[] = [];
  @Input() maxAmount: number = 25;
  @Input() sortOption: SortOptions = SortOptions.date;
  @Input() statusOption: StatusOptions = StatusOptions.nostatus;

  @Input() showMaxAmount: boolean = true;
  @Input() showSortOptions: boolean = true;
  @Input() showStatusOptions: boolean = true;
  @Input() showSearch: boolean = true;

  @Output() filteredCommunicationsEvent: EventEmitter<ICommunication[]> = new EventEmitter();
  @Output() maxAmountEvent: EventEmitter<number> = new EventEmitter();

  public filteredCommunications: ICommunication[] = [];
  public sortOptions: string[] = Object.values(SortOptions);
  public statusOptions: string[] = Object.values(StatusOptions);

  public amounts: number[] = [25, 50, 100];
  public searchPhrase: string = '';

  public lang = LangManager;

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['communications']) {
      this.filteredCommunications = [...this.communications];
      this.onCommunicationsSort(this.sortOption);
      if (this.searchPhrase) this.onCommunicationSearch(this.searchPhrase);
    }
  }

  public onCommunicationsSort(sortOption: string | SortOptions): void {
    switch (sortOption) {
      case SortOptions.startAlpha:
        this.alphabeticalSort(false);
        break;
      case SortOptions.endAlpha:
        this.alphabeticalSort(true);
        break;
      case SortOptions.variants:
        this.variantSort();
        break;
      case SortOptions.attachments:
        this.attachmentSort();
        break;
      case SortOptions.date:
        this.dateSort(false);
        break;
    }

    this.sortOption = sortOption as SortOptions;
    this.onFilteredCommunicationsEvent(this.filteredCommunications);
  }

  public onCommunicationsStatus(statusOption: string | StatusOptions): void {
    switch (statusOption) {
      case StatusOptions.metadata:
        this.filteredCommunications = this.communications.filter((communication: ICommunication) => {
          return Number(communication.letter.status) === TRANSCRIPTION_STATUS.METADATA;
        });
        break;
      case StatusOptions.transcription:
        this.filteredCommunications = this.communications.filter((communication: ICommunication) => {
          return Number(communication.letter.status) === TRANSCRIPTION_STATUS.TRANSCRIPTION;
        });
        break;
      case StatusOptions.conclusion:
        this.filteredCommunications = this.communications.filter((communication: ICommunication) => {
          return Number(communication.letter.status) === TRANSCRIPTION_STATUS.CONCLUSION;
        });
        break;
      default:
        this.filteredCommunications = [...this.communications];
        break;
    }

    this.statusOption = statusOption as StatusOptions;
    if (this.searchPhrase !== '') this.onCommunicationSearch(this.searchPhrase);
    else this.onFilteredCommunicationsEvent(this.filteredCommunications);
    this.onCommunicationsSort(this.sortOption);
  }

  public onCommunicationSearch(searchPhrase: string): void {
    this.filteredCommunications = this.filteredCommunications.filter((c: ICommunication) => {
      const searchString: string = removeAccents(searchPhrase)?.toLocaleLowerCase() ?? '';
      return removeAccents(c.letter.label.toLocaleLowerCase()).includes(searchString);
    });
    this.onFilteredCommunicationsEvent(this.filteredCommunications);
    this.onCommunicationsSort(this.sortOption);
  }

  public onMaxAmountEvent(maxAmount: number): void {
    this.maxAmount = maxAmount;
    this.maxAmountEvent.emit(maxAmount);
  }

  private alphabeticalSort(desc: boolean): void {
    this.filteredCommunications.sort((a: ICommunication, b: ICommunication) => {
      if (!a.letter || !b.letter) return -1;
      const compareValue: number = a.letter.label.localeCompare(b.letter.label);
      return desc ? -1 * compareValue : compareValue;
    });
  }

  private variantSort(): void {
    this.filteredCommunications.sort((a: ICommunication, b: ICommunication) => {
      return b.variants - a.variants;
    });
  }

  private attachmentSort(): void {
    this.filteredCommunications.sort((a: ICommunication, b: ICommunication) => {
      return b.attachments - a.attachments;
    });
  }

  private dateSort(desc: boolean): void {
    this.filteredCommunications.sort((a: ICommunication, b: ICommunication): number => {
      const aISOString: string = a.dateStart ?? new Date().toISOString();
      const bISOString: string = b.dateStart ?? new Date().toISOString();

      const sorting: number = aISOString < bISOString ? 1 : aISOString > bISOString ? -1 : 0;
      return desc ? sorting : sorting * -1;
    });
  }

  public onFilterEntriesBySearchEvent($event: Event): void {
    const targetElement: HTMLInputElement = ($event as InputEvent).target as HTMLInputElement;

    this.filteredCommunications = [...this.communications];
    this.searchPhrase = targetElement.value;
    this.onCommunicationsStatus(this.statusOption);
  }

  private onFilteredCommunicationsEvent(filteredCommunications: ICommunication[]): void {
    this.filteredCommunicationsEvent.emit([...filteredCommunications]);
  }
}
