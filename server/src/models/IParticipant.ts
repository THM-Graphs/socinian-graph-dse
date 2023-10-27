import { IEntity } from "./IEntity";

export interface IParticipant {
  type: string;
  dateEnd: string;
  dateCertainty: string;
  dateStart: string;
  dateType: string;
  place: IEntity;
  person: IEntity;
  data?: string;
}
