import { IParticipant } from './IParticipant';
import { IText } from './IText';
import { ICommunication } from './ICommunication.js';

export interface IMetadata {
  guid: string;
  doctype: string;
  label: string;
  editor: string | null;
  status: number;
  abstract: IText;
  variants: IText[];
  participants: IParticipant[];
  attachedBy: ICommunication[];
  data?: string;
}
