import { IMetadata } from './IMetadata';
import { Nullable } from '../types.js';

export interface ICommunication {
  guid: string;
  letter: Nullable<IMetadata>;
  attachments: IMetadata[];
  data: string;
}
