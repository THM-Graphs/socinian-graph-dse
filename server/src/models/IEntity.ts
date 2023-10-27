import { IMetadata } from "./IMetadata";
import { INormdata } from "./INormdata";

export interface IEntity {
  guid: string;
  type: string;
  label: string;
  data: string;
  normdata: INormdata[];
  additionalLabels: IAdditionalLabel[];
  additionalInformation: string[];
  occurrences?: IMetadata[];
}

export interface IAdditionalLabel {
  forename: string;
  surname: string;
  label: string;
}
