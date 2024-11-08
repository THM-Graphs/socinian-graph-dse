import { IMetadata } from './IMetadata';
import { Nullable } from '../types.js';
import { ISection } from './ISection.js';
import { INode } from './INode.js';

export interface ICommunication extends INode {
  guid: string;
  dateStart: Nullable<string>;
  letter: Nullable<IMetadata>;
  attached: IMetadata[];
  attachments: number;
  variants: number;
  sections: ISection[];
}
