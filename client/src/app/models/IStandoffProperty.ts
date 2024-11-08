import { IText } from './IText';

export interface IStandoffProperty {
  guid: string;
  startIndex: number;
  endIndex: number;
  isZeroPoint: boolean;
  text: string;
  teiType: string;
  type: string;
  comment?: IText;
  data: string;
  standoffProperties?: IStandoffProperty[];
}
