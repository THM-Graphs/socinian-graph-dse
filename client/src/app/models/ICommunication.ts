import { IMetadata } from "./IMetadata";

export interface ICommunication {
  guid: string;
  letter: IMetadata;
  attachments: IMetadata[];
  data?: string;
}
