import { ICommunication } from "./ICommunication";
import { IStandoffProperty } from "./IStandoffProperty";

export interface ISection {
  guid: string;
  label: string;
  text: string;
  standoffProperties: IStandoffProperty[];
  communications: ICommunication[];
  children: ISection[];
  data?: string;
}
