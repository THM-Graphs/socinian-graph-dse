import { IParticipant } from './IParticipant';
import { IText } from './IText';
import { Nullable } from '../types.js';

export interface IMetadata {
  guid: string;
  doctype: string;
  label: string;
  editor: string;
  status: string;
  abstract: Nullable<IText>;
  variants: IText[];
  participants: IParticipant[];
  data: string;
}
