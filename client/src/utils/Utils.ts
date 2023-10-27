export class Utils {
  public static deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

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
      .replace(/(^"|"$)/g, "")
      .replace("'", "'")
      .replace('"', '"');
  }

  public static findEnumElementByValue(enumeration: any, value: string): [string, string] {
    const enumOptions: [string, string][] = Object.entries(enumeration);
    return enumOptions.find((option) => option[1] === value) ?? ["", ""];
  }

  public static findEnumElementByKey(enumeration: any, key: string): [string, string] {
    const enumOptions: [string, string][] = Object.entries(enumeration);
    return enumOptions.find((option) => option[0] === key) ?? ["", ""];
  }
}
