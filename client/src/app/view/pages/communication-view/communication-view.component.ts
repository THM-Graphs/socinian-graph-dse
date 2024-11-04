import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunicationService } from '../../../services/communication.service';
import { LangManager } from '../../../../utils/LangManager';
import { IText } from 'src/app/models/IText';
import { ICommunication } from 'src/app/models/ICommunication';
import { IMetadata } from 'src/app/models/IMetadata';
import { MetadataService } from 'src/app/services/metadata.service';
import { CommunicationViewUtils } from './communication-view.utils';
import { IParticipant } from 'src/app/models/IParticipant';
import { AnnotationListService } from 'src/app/services/annotation-list.service';
import { TextService } from 'src/app/services/text.service';
import { Nullable } from '../../../../global.js';

interface MetaData {
  label: string;
  href?: string;
  value: string;
}
@Component({
  selector: 'app-view',
  templateUrl: './communication-view.component.html',
  styleUrls: ['./communication-view.component.scss'],
})
export class CommunicationView implements OnInit, OnDestroy {
  public isLoading: boolean = true;
  public isCopiedToClipboard: boolean = false;
  public isAbstractOpen: boolean = true;
  public isMetadataOpen: boolean = true;
  public isAttachmentsOpen: boolean = true;
  public isAttachedByOpen: boolean = true;
  public isQuotable: boolean = false;

  public communication: ICommunication;
  public selectedLetter: IMetadata;
  public selectedVariant: IText;

  public variants: IText[] = [];
  public referenceText: IText;

  public sender: IParticipant;
  public receiver: IParticipant;

  public metadata: MetaData[] = [];
  public additionalMetaData: MetaData[] = [];
  public lang = LangManager;

  constructor(
    private communicationService: CommunicationService,
    private metadataService: MetadataService,
    private textService: TextService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private annotationService: AnnotationListService,
  ) {}

  public async ngOnInit(): Promise<void | boolean> {
    const metadataId: string | null = this.activatedRoute.snapshot.paramMap.get('guid');
    if (!metadataId) return this.redirectToCollection();
    await this.loadCommunicationView(metadataId);
    this.isLoading = false;
  }

  public ngOnDestroy(): void {
    this.annotationService.clearList();
  }

  public changeSelectedLetter(letter: IMetadata): void {
    this.sender = CommunicationViewUtils.getSender(letter);
    this.receiver = CommunicationViewUtils.getReceiver(letter);
    this.selectedLetter = letter;

    const reference: IText | undefined = letter.variants.find((v: IText) => !!v.metadataIsReference);

    this.referenceText = reference ?? letter.variants[0];
    this.variants = letter.variants.filter((v: IText) => !v.metadataIsReference);

    const quotedId: string = this.activatedRoute.snapshot.queryParamMap.get('guid') ?? '';
    const quotedText: Nullable<IText> = letter.variants.find((v: IText): boolean => v.guid === quotedId);

    this.changeSelectedVariant(quotedText ?? this.referenceText);
    this.populateMetaData();
  }

  public changeSelectedVariant(variant: IText): void {
    this.selectedVariant = variant;
    this.populateAdditionalMetaData();
  }

  public scrollToAttachments(): void {
    const attachments: HTMLElement | null = document.querySelector('.attachments');
    const top: number = attachments?.offsetTop ? attachments.offsetTop - 50 : 0;

    window.scroll({
      top,
      left: 0,
      behavior: 'smooth',
    });
  }

  public async copyURLtoClipboard(): Promise<void> {
    await navigator.clipboard.writeText(`https://${location.host}/id/${this.selectedLetter.guid}`);
    this.isCopiedToClipboard = true;

    setTimeout(() => {
      this.isCopiedToClipboard = false;
    }, 2000);
  }

  public isMetadataEmpty(): boolean {
    return !this.metadata.find((m: MetaData) => m.value);
  }

  private async loadCommunicationView(metadataId: string): Promise<void | boolean> {
    const communication: Nullable<ICommunication> = await this.communicationService.getCommunication(metadataId);
    let letter: IMetadata | undefined | null = communication?.letter;

    if (!letter) letter = await this.metadataService.getMetadata(metadataId);
    if (!letter) return this.loadParentDataView(metadataId);

    this.communication = communication as ICommunication;
    this.isQuotable = true; // letter.status === TRANSCRIPTION_STATUS.CONCLUSION;
    this.changeSelectedLetter(letter);
  }

  private async loadParentDataView(textId: string): Promise<void | boolean> {
    const text: Nullable<IText> = await this.textService.getText(textId);
    let letter: IMetadata | undefined | null = text?.letter;
    if (!letter || !text) return this.redirectToCollection();

    letter = await this.metadataService.getMetadata(letter.guid);
    if (!letter) return this.redirectToCollection();

    this.changeSelectedLetter(letter);
    this.changeSelectedVariant(text);
  }

  private async redirectToCollection(): Promise<boolean> {
    return this.router.navigate(['/collection']);
  }

  private populateAdditionalMetaData(): void {
    this.additionalMetaData = [
      {
        label: 'TEXT_VIEW_PAGE_VARIANT_ARCHIVE',
        value: this.selectedVariant.metadataArchive ?? '',
      },
      {
        label: 'TEXT_VIEW_PAGE_VARIANT_SHELFMARK',
        value: this.selectedVariant.metadataShelfmark ?? '',
      },
      {
        label: 'TEXT_VIEW_PAGE_VARIANT_TEXT_TYPE',
        value: CommunicationViewUtils.getTextType(this.selectedVariant.metadataTextType),
      },
      {
        label: 'TEXT_VIEW_PAGE_VARIANT_TEXT_GENRE',
        value: this.selectedVariant.metadataTextGenre ?? '',
      },
      {
        label: 'TEXT_VIEW_PAGE_VARIANT_LANGUAGE',
        value: CommunicationViewUtils.getLanguage(this.selectedVariant.metadataLanguage),
      },
      {
        label: 'TEXT_VIEW_PAGE_VARIANT_LICENCE',
        value: this.selectedVariant.metadataLicence ? new URL(this.selectedVariant.metadataLicence).hostname : '',
        href: this.selectedVariant.metadataLicence ?? '',
      },
      {
        label: 'TEXT_VIEW_PAGE_VARIANT_PRINT_SOURCE_NAME',
        value: this.selectedVariant.metadataPrintSourceName ?? '',
        href: this.selectedVariant.metadataPrintSourceUrl ?? '',
      },
    ];
  }

  private populateMetaData(): void {
    this.metadata = [
      {
        label: 'TEXT_VIEW_PAGE_SENDER',
        href: '/entry/' + this.sender?.person?.guid,
        value: this.sender?.person?.label,
      },
      {
        label: 'TEXT_VIEW_PAGE_SENDER_PLACE',
        href: '/entry/' + this.sender?.place?.guid,
        value: this.sender?.place?.label,
      },
      {
        label: 'TEXT_VIEW_PAGE_SENT_DATE',
        value: CommunicationViewUtils.getParticipantDate(this.sender),
      },
      {
        label: 'TEXT_VIEW_PAGE_RECEIVER',
        href: '/entry/' + this.receiver?.person?.guid,
        value: this.receiver?.person?.label,
      },
      {
        label: 'TEXT_VIEW_PAGE_RECEIVER_PLACE',
        href: '/entry/' + this.receiver?.place?.guid,
        value: this.receiver?.place?.label,
      },
      {
        label: 'TEXT_VIEW_PAGE_RECEIVED_DATE',
        value: CommunicationViewUtils.getParticipantDate(this.receiver),
      },
    ];
  }
}
