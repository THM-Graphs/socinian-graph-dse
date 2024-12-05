import { IMetadata } from './IMetadata';
import { Nullable } from '../../global.js';

export interface ICommunication {
  guid: string;
  dateStart: Nullable<string>;
  sentBy: Nullable<string>;
  letter: IMetadata;
  attachments: number;
  variants: number;
  attached: IMetadata[];
  data?: string;
}
