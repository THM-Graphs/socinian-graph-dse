import { IEntity } from "./IEntity";

export enum ParticipantType {
  receivedPerson = "receivedPerson",
  sentPerson = "sentPerson",
}

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
