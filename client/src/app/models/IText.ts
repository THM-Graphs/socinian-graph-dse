import { IMetadata } from './IMetadata';
import { IStandoffProperty } from './IStandoffProperty';

export interface IText {
  letter: IMetadata;
  standoffProperties: IStandoffProperty[];

  guid: string;
  label: string;
  text: string;
  type: string;

  metadataRemark: IText;
  metadataLanguage: string;
  metadataLicence: string;
  metadataShelfmark: string;
  metadataTextGenre: string;
  metadataTextType: string;
  metadataArchive: string;
  metadataIsReference: string | boolean;
  metadataPrintSourceName: string;
  metadataPrintSourceUrl: string;
  metadataFunder: string;

  data: string;
}
