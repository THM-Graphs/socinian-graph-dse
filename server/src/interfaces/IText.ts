import { IMetadata } from './IMetadata';
import { IAnnotation } from './IAnnotation.js';
import { INode } from './INode.js';
import { Nullable } from '../types.js';

export interface IBaseText extends INode {
  guid: string;
  text: string;
  label: string;
}

export interface IText extends IBaseText {
  letter: Nullable<IMetadata>;
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
  metadataFunder: string;
  annotations: IAnnotation[];
}
