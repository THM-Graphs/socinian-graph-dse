import { IParticipant } from "./IParticipant";
import { IText } from "./IText";

export interface IMetadata {
  guid: string;
  doctype: string;
  label: string;
  editor: string;
  status: string;
  abstract: IText;
  variants: IText[];
  participants: IParticipant[];
  data?: string;
}
