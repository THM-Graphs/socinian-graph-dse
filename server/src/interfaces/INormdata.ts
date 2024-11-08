import { INode } from './INode.js';

export interface INormdata extends INode {
  guid: string;
  label: string;
  namespace: string;
  prefix: string;
  wikidata: string;
}
