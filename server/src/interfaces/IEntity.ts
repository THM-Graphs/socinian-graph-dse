import { IMetadata } from './IMetadata';
import { INormdata } from './INormdata';

export interface IEntity {
  guid: string;
  type: EntityType;
  label: string;
  data: string;
  normdata: INormdata[];
  additionalLabels: IAdditionalLabel[];
  additionalInformation: string[];
  occurrences: IMetadata[];
}

export interface IAdditionalLabel {
  forename: string;
  surname: string;
  label: string;
}

export type EntityType = 'person' | 'place' | 'term' | 'bible_verse';
