import { IParticipant } from './IParticipant';
import { IText } from './IText';
import { Nullable } from '../types.js';
import { INode } from './INode.js';

export interface IMetadata extends INode {
  guid: string;
  doctype: string;
  label: string;
  editor: string;
  status: string;
  abstract: Nullable<IText>;
  variants: IText[];
  participants: IParticipant[];
}
