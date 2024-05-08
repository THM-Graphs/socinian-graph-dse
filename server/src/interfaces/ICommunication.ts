import { IMetadata } from './IMetadata';
import { Nullable } from '../types.js';
import { ISection } from './ISection.js';
import { INode } from './INode.js';

export interface ICommunication extends INode {
  guid: string;
  letter: Nullable<IMetadata>;
  attachments: IMetadata[];
  sections: ISection[];
}
