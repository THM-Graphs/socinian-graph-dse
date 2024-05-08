import { IEntity } from './IEntity';
import { Nullable } from '../types.js';

export interface IParticipant {
  type: string;
  dateEnd: string;
  dateCertainty: string;
  dateStart: string;
  dateType: string;
  place: Nullable<IEntity>;
  person: Nullable<IEntity>;
  data: string;
}
