import { EntityType, IEntity } from './IEntity';
import { IMetadata } from './IMetadata';
import { Nullable } from '../types.js';

export interface ISearchEntry {
  guid: string;
  label: string;
}

export interface ISearchLetterEntry extends ISearchEntry {
  occurrences: string[];
  text: Nullable<string>;
  reference: Nullable<IMetadata>;
}

export interface ISearchEntity extends ISearchEntry {
  type: EntityType;
  reference: Nullable<IEntity>;
}

export interface ISearch {
  letters: IMetadata[];
  entities: IEntity[];
  phrase: string;
}
