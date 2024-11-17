import { ENTITY_CATEGORY } from '../constants/ENTITY_CATEGORY';
import { IMetadata } from './IMetadata';
import { INormdata } from './INormdata';

export interface IEntity {
  guid: string;
  type: ENTITY_CATEGORY;
  label: string;
  normdata: INormdata[];
  additionalLabels: IAdditionalLabel[];
  additionalInformation: string[];

  mentions: number;

  occurrences: IMetadata[];
  data?: string;
}

export interface IAdditionalLabel {
  forename: string;
  surname: string;
  label: string;
}
