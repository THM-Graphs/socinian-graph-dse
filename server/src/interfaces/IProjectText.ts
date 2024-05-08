import { INode } from './INode.js';

export interface IProjectText extends INode {
  guid: string;
  label: string;
  text: string;
}
