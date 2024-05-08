import { IText } from './IText';
import { INode } from './INode.js';

export interface IStandoffProperty extends INode {
  guid: string;
  startIndex: number;
  endIndex: number;
  text: string;
  teiType: string;
  type: string;
  comment: IText;
  standoffProperties: IStandoffProperty[];
}
