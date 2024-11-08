import { IText } from './IText';
import { INode } from './INode.js';

export interface IAnnotation extends INode {
  guid: string;
  startIndex: number;
  endIndex: number;
  isZeroPoint: boolean;
  text: string;
  teiType: string;
  type: string;
  comment: IText;
  annotations: IAnnotation[];
}
