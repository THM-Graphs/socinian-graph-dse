import { IMetadata } from './IMetadata';
import { INormdata } from './INormdata';
import { INode } from './INode.js';

export interface IEntity extends INode {
  guid: string;
  type: EntityType;
  label: string;
  normdata: INormdata[];
  additionalLabels: IAdditionalLabel[];
  additionalInformation: string[];
  occurrences: IMetadata[];
}

export interface IAdditionalLabel extends INode {
  forename: string;
  surname: string;
  label: string;
}

export type EntityType = 'person' | 'place' | 'term' | 'bible_verse' | '';
