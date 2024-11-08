import { INode } from '../interfaces/INode.js';

export class Utils {
  public static arrayToObject<T>(array: T[]): { [key: string]: T } {
    const obj: { [key: string]: T } = {};
    for (const [index, value] of array.entries()) {
      obj[index.toString()] = value;
    }
    return obj;
  }

  public static matchWordsAndQuotes(phrase: string): string[] {
    return phrase.match(/"(?:\\"|[^"])+"|\S+/g)?.map((s) => this.escapeAndRemoveQuotes(s)) ?? [];
  }

  public static escapeAndRemoveQuotes(word: string): string {
    return word
      .replace(/(^"|"$)/g, '')
      .replace("'", "'")
      .replace('"', '"');
  }

  public static stringifyNode<T extends INode>(node: T): T {
    node.data = JSON.stringify(node);
    return node;
  }
}
