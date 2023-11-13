export class SelectionUtils {
  public static isSelectionBackwards(selection: Selection): boolean {
    if (!selection.anchorNode || !selection.focusNode) return false;
    const position: number = selection.anchorNode?.compareDocumentPosition(selection.focusNode);

    const isNodeOffsetDifferent: boolean = !position && selection.anchorOffset > selection.focusOffset;
    const isNodesTraverseDifferent: boolean = position === Node.DOCUMENT_POSITION_PRECEDING;
    return isNodeOffsetDifferent || isNodesTraverseDifferent;
  }

  public static getSelectionStartIndex(startingNode: Node, offset: number): number {
    const parentNodes: string[] = ["div", "p"];
    const startingText: string = startingNode.textContent!;

    let textLength: number = offset;
    let parentElement: HTMLElement = startingNode.parentElement!;

    while (parentElement) {
      if (parentNodes.includes(parentElement.tagName.toLowerCase())) break;
      parentElement = parentElement.parentElement!;
    }

    const nodeList: Node[] = Array.from(parentElement.childNodes);
    for (const node of nodeList) {
      const nodeText: string = node.textContent ?? "";
      if (nodeText.includes(startingText)) break;

      if (node.nodeType === Node.ELEMENT_NODE) {
        const classList: DOMTokenList = (<HTMLElement>node).classList;
        if (classList.contains("pb")) continue;
      }

      textLength += nodeText.length;
    }

    const parentStartIndex: number = Number(parentElement.dataset.start);
    return textLength + parentStartIndex;
  }
}
