import { IMetadata } from './IMetadata';
import { IStandoffProperty } from './IStandoffProperty';
import { INode } from './INode.js';

export interface IText extends INode {
  guid: string;
  label: string;
  text: string;
  letter: IMetadata;
  type: string;
  metadataLanguage: string;
  metadataLicence: string;
  metadataShelfmark: string;
  metadataRemark: IText;
  metadataTextGenre: string;
  metadataTextType: string;
  metadataArchive: string;
  metadataIsReference: boolean;
  metadataPrintSourceName: string;
  metadataPrintSourceUrl: string;
  standoffProperties: IStandoffProperty[];
}
