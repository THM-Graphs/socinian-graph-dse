import { ICommunication } from "./ICommunication";

export interface ISection {
  guid?: string;
  label?: string;
  text?: string;
  communications?: ICommunication[];
  children?: ISection[];
  data?: string;
}
