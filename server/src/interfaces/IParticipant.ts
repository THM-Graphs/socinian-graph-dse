import { IEntity } from './IEntity';
import { Nullable } from '../types.js';
import { INode } from './INode.js';

export interface IParticipant extends INode {
  type: string;
  dateEnd: string;
  dateCertainty: string;
  dateStart: string;
  dateType: string;
  place: Nullable<IEntity>;
  person: Nullable<IEntity>;
}
