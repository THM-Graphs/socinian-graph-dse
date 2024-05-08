import { IMetadata } from './IMetadata';
import { Nullable } from '../types.js';
import { ISection } from './ISection.js';

export interface ICommunication {
  guid: string;
  letter: Nullable<IMetadata>;
  attachments: IMetadata[];
  sections: ISection[];
  data: string;
}
