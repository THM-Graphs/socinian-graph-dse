import { IEntity } from "./IEntity";

export enum PARTICIPANT {
  RECEIVER = "receivedPerson",
  SENDER = "sentPerson",
}

export interface IParticipant {
  type: PARTICIPANT;
  dateEnd: string;
  dateCertainty: string;
  dateStart: string;
  dateType: string;
  place: IEntity;
  person: IEntity;
  data?: string;
}
