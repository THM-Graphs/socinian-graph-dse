import { IStandoffProperty } from "src/app/models/IStandoffProperty";
import AnnotationHandler from "./AnnotationHandler";
import AnnotationUtils from "./AnnotationUtils";

export interface Annotation {
  element: string;
  attributes: string[];
  identifier: string;
  guid?: string;
}

export class AnnotationParser {
  protected rawText: string = "";
  protected annotatedText: string = "";

  protected standOffProperties: IStandoffProperty[] = [];
  protected annotationStack: Annotation[] = [];

  constructor(rawText: string, standOffProperties: IStandoffProperty[]) {
    this.rawText = rawText;
    this.standOffProperties = [...standOffProperties];
    this.orderStandOffByStartIndex();
  }

  public parseText(): string {
    this.annotatedText = "";

    for (let i: number = 0; i < this.rawText.length; i++) {
      const startProperties: IStandoffProperty[] = [];
      const endProperties: IStandoffProperty[] = [];

      for (const standOffProperty of this.standOffProperties) {
        try {
          if (i === standOffProperty.startIndex) {
            startProperties.push(standOffProperty);
          }

          if (i === standOffProperty.endIndex) {
            endProperties.push(standOffProperty);
          }
        } catch (error: unknown) {
          console.error("Could not parse start of teiType", standOffProperty.teiType, error);
        }
      }

      // Sorting them by start & end property ruleset.
      startProperties.sort(AnnotationUtils.sortStartProperties);
      endProperties.sort(AnnotationUtils.sortEndProperties);

      // Parsing them into HTML context.
      const HTMLStartAnnotations: string[] = startProperties.map((property) => this.parseTeiType(property));
      const HTMLEndAnnotations: string[] = endProperties.map((property) => this.parseTeiType(property, true));

      // Sorting them by HTML ruleset.
      HTMLStartAnnotations.sort(AnnotationUtils.sortHTMLStartAnnoations);
      HTMLEndAnnotations.sort(AnnotationUtils.sortHTMLEndAnnotations);

      this.annotatedText += HTMLStartAnnotations.filter((a) => a.length > 0).join("");
      this.annotatedText += this.rawText[i];
      this.annotatedText += HTMLEndAnnotations.filter((a) => a.length > 0).join("");
    }

    return this.annotatedText;
  }

  protected parseTeiType(standOffProperty: IStandoffProperty, isClosing: boolean = false): string {
    let annotation: Annotation;

    switch (standOffProperty.teiType) {
      case "l":
      case "addrLine":
        return !isClosing ? "" : "<br />";
      case "lb":
        return !isClosing ? "<br />" : "";
      case "div":
        return !isClosing ? "<div>" : "</div>";
      case "dateline":
      case "address":
      case "lg":
      case "salute":
      case "signed":
        annotation = AnnotationHandler.handleCustomParagraph(standOffProperty);
        break;
      case "opener":
      case "closer":
        return !isClosing ? `<div class="${standOffProperty.teiType}">` : "</div>";
      case "item":
        return !isClosing ? "<li>" : "</li>";
      case "list":
        return !isClosing ? "<ul>" : "</ul>";
      case "table":
        return !isClosing ? "<table>" : "</table>";
      case "row":
        return !isClosing ? "<tr>" : "</tr>";
      case "abbr":
        annotation = AnnotationHandler.handleAbbr(standOffProperty);
        break;
      case "add":
        annotation = AnnotationHandler.handleAdd(standOffProperty);
        break;
      case "bibl":
        annotation = AnnotationHandler.handleBibl(standOffProperty);
        break;
      case "cell":
        return AnnotationHandler.handleCell(standOffProperty, isClosing);
      case "commented":
        annotation = AnnotationHandler.handleCommented(standOffProperty);
        break;
      case "date":
        annotation = AnnotationHandler.handleDate(standOffProperty);
        break;
      case "del":
        annotation = AnnotationHandler.handleDel(standOffProperty);
        break;
      case "gap":
        annotation = AnnotationHandler.handleGap(standOffProperty);
        break;
      case "head":
        return !isClosing ? "<h6 class='spo-headline'>" : "</h6>";
      case "hi":
        annotation = AnnotationHandler.handleHi(standOffProperty);
        break;
      case "name":
        annotation = AnnotationHandler.handleName(standOffProperty);
        break;
      case "note":
        annotation = AnnotationHandler.handleNote(standOffProperty);
        break;
      case "p":
        annotation = AnnotationHandler.handleParagraph(standOffProperty);
        break;
      case "pb":
        return AnnotationHandler.handlePb(standOffProperty, isClosing);
      case "persName":
        annotation = AnnotationHandler.handlePersName(standOffProperty);
        break;
      case "placeName":
        annotation = AnnotationHandler.handlePlace(standOffProperty);
        break;
      case "postscript":
        annotation = AnnotationHandler.handlePostscript();
        break;
      case "reg":
        annotation = AnnotationHandler.handleReg(standOffProperty);
        break;
      case "rs":
        annotation = AnnotationHandler.handleRegisterEntry(standOffProperty);
        break;
      case "sic":
        annotation = AnnotationHandler.handleSic(standOffProperty);
        break;
      case "subst":
        annotation = AnnotationHandler.handleSubst();
        break;
      case "supplied":
        annotation = AnnotationHandler.handleSupplied(standOffProperty);
        break;
      case "unclear":
        annotation = AnnotationHandler.handleUnclear(standOffProperty);
        break;
      case "ref":
        annotation = AnnotationHandler.handleRef(standOffProperty);
        break;
      case "foreign":
      case "comment":
        return "";
      case "selection":
        annotation = AnnotationHandler.handleSelection(standOffProperty);
        break;
      default:
        console.error("Could not parse TEI type:", standOffProperty.teiType);
        return "";
    }

    annotation.guid = standOffProperty.guid;
    this.handleAnnotationStack(annotation, isClosing);
    return this.getOverlappedHTMLTag(annotation, isClosing);
  }

  private getOverlappedHTMLTag(annotation: Annotation, isClosing: boolean): string {
    const attributes: string[] = isClosing ? [] : [...annotation.attributes];
    const identifier: string[] = isClosing ? [] : [annotation.identifier];
    let overlappedHTML: string = "";

    const existingAnnotations: Annotation[] = this.annotationStack.filter((a) => a.element === annotation.element);

    if (existingAnnotations.length === 0 && isClosing) {
      return `</${annotation.element}>`;
    }

    if (existingAnnotations.length > 0) {
      overlappedHTML = `</${annotation.element}>`;
      existingAnnotations.forEach((e: Annotation) => {
        e.attributes.forEach((attr) => !attributes.includes(attr) && attributes.push(attr));
        !identifier.includes(e.identifier) && identifier.push(e.identifier);
      });
    }

    const attributeString: string = attributes.join(" ");
    const identifierString: string = identifier.join(" ");
    return `${overlappedHTML}<${annotation.element} class="${identifierString}" ${attributeString}>`;
  }

  private handleAnnotationStack(annotation: Annotation, isClosing: boolean): void {
    if (isClosing) {
      const index: number = this.annotationStack.findIndex((a) => a.identifier === annotation.identifier);
      this.annotationStack.splice(index, 1);
    } else this.annotationStack.push(annotation);
  }

  private orderStandOffByStartIndex() {
    this.standOffProperties.sort((a: IStandoffProperty, b: IStandoffProperty) => a.startIndex - b.startIndex);
  }
}
