export class TextViewSelectionUtils {
  private static parentNodes: string[] = ['div', 'p', 'h6'];

  public static isSelectionBackwards(selection: Selection): boolean {
    if (!selection.anchorNode || !selection.focusNode) return false;
    const position: number = selection.anchorNode?.compareDocumentPosition(selection.focusNode);

    const isNodeOffsetDifferent: boolean = !position && selection.anchorOffset > selection.focusOffset;
    const isNodesTraverseDifferent: boolean = position === Node.DOCUMENT_POSITION_PRECEDING;
    return isNodeOffsetDifferent || isNodesTraverseDifferent;
  }

  public static getSelectionStartIndex(node: Node, offset: number): number {
    const parentElement: HTMLElement = this.getParentElement(node);
    const startingNode: Node = this.getStartingNode(node);
    const nodeList: Node[] = [];

    let currentNode: Node | null = startingNode.previousSibling;
    let textLength: number = offset;

    while (currentNode) {
      nodeList.push(currentNode);
      currentNode = currentNode.previousSibling;
    }

    for (const node of nodeList) {
      if (node.nodeName === 'SPAN') {
        const htmlNode: HTMLElement = node as HTMLElement;
        if (htmlNode.classList.contains('zpa')) continue;
      }

      const nodeText: string = node.textContent ?? '';
      textLength += nodeText.length;
    }

    const parentStartIndex: number = Number(parentElement.dataset.start);
    return textLength + parentStartIndex;
  }

  public static getSelectionEndIndex(node: Node, start: number, length: number): number {
    const startingNode: Node = this.getStartingNode(node);
    const nodeList: Node[] = [];

    let currentNode: Node | null = startingNode.nextSibling;
    let textLength: number = length - 1;
    let selectionLength: number = length - 1;

    while (textLength > 0 && currentNode) {
      nodeList.push(currentNode);

      const nodeLength: number = currentNode?.textContent?.length ?? 0;
      textLength = textLength - nodeLength;
      currentNode = currentNode.nextSibling;
    }

    for (const node of nodeList) {
      if (node.nodeName === 'SPAN') {
        const htmlNode: HTMLElement = node as HTMLElement;
        if (!htmlNode.classList.contains('zpa')) continue;
        selectionLength -= htmlNode.textContent?.length ?? 0;
      }
    }

    return start + selectionLength;
  }

  private static getParentElement(node: Node): HTMLElement {
    let parentElement: HTMLElement = node.parentElement!;

    while (parentElement) {
      if (this.parentNodes.includes(parentElement.tagName.toLowerCase())) break;
      parentElement = parentElement.parentElement!;
    }

    return parentElement;
  }

  public static getStartingNode(node: Node): Node {
    let parentElement: HTMLElement = node.parentElement!;
    let startingNode: Node = node;

    while (parentElement) {
      if (this.parentNodes.includes(parentElement.tagName.toLowerCase())) break;
      startingNode = node.parentNode!;
      parentElement = parentElement.parentElement!;
    }

    return startingNode;
  }
}
