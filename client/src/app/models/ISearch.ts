import { ENTITY_CATEGORY } from "../constants/ENTITY_CATEGORY.js";
import { IEntity } from "./IEntity";
import { IMetadata } from "./IMetadata";

export interface ISearchLetterEntry {
  guid: string;
  label: string;
  occurrences: string[];
  reference?: IMetadata;
}

export interface ISearchEntity {
  guid: string;
  label: string;
  type: ENTITY_CATEGORY;
  reference?: IEntity;
}

export interface ISearch {
  letters: ISearchLetterEntry[];
  entities: ISearchEntity[];
  phrase: string;
}
