import { ENTITY_TYPES } from "../const/ENTITY_TYPES";
import { IMetadata } from "./IMetadata";
import { INormdata } from "./INormdata";
export interface IEntity {
  guid: string;
  type: string | ENTITY_TYPES;
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
