import { ICommunication } from './ICommunication';
import { INode } from './INode.js';

export interface ISection extends INode {
  guid: string;
  label: string;
  text: string;
  communications: ICommunication[];
  children: ISection[];
}
