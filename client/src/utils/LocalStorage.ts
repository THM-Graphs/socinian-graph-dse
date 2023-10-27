export class LocalStorage {
  constructor(private key: string) {}

  /**
   * Returns items for a specified key as javascript object
   *
   * @returns {Object} items as javascript object or null if its empty
   */
  public getItems(): any {
    const items: any | null = localStorage.getItem(this.key);
    if (items === null || items === undefined || Object.keys(items)?.length === 0) {
      return null;
    }
    return JSON.parse(items);
  }

  /**
   * Accepts a generic array and stores it in localStorage as JSON Object
   *
   * @param items : T[] which have to been stored
   */
  public setItems<T>(items: T[] | T): void {
    if (items === undefined || items === null) {
      return;
    }
    localStorage.setItem(this.key, JSON.stringify(items));
  }

  /**
   * Removes all items out of localStorage for specified key
   */
  public removeItems(): void {
    localStorage.removeItem(this.key);
  }
}
