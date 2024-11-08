import { IStandoffProperty } from 'src/app/models/IStandoffProperty';
import AnnotationHandler from './AnnotationHandler';
import AnnotationUtils from './AnnotationUtils';
import { Nullable } from '../../global';

export interface Annotation {
  guid?: Nullable<string>;
  containment?: Nullable<number>;

  element: string;
  attributes: string[];
  identifier: string;
  innerHTML?: Nullable<string>;
}

export class AnnotationParser {
  protected rawText: string = '';
  protected annotatedText: string = '';

  protected standOffProperties: IStandoffProperty[] = [];
  protected annotations: Annotation[] = [];

  constructor(rawText: Nullable<string>, standOffProperties: IStandoffProperty[]) {
    this.rawText = rawText ?? '';
    this.standOffProperties = [...standOffProperties];
    this.standOffProperties.sort(AnnotationUtils.sortStartProperties);
  }

  public parseText(): string {
    this.annotatedText = '';

    for (let i: number = 0; i < this.rawText.length; i++) {
      const startProperties: IStandoffProperty[] = [];
      const endProperties: IStandoffProperty[] = [];
      const zeroPointProperties: IStandoffProperty[] = [];

      for (const standOffProperty of this.standOffProperties) {
        try {
          if (i === standOffProperty.startIndex && i === standOffProperty.endIndex) {
            zeroPointProperties.push(standOffProperty);
            continue;
          }

          if (i === standOffProperty.startIndex) {
            startProperties.push(standOffProperty);
          }

          if (i === standOffProperty.endIndex) {
            endProperties.push(standOffProperty);
          }
        } catch (error: unknown) {
          console.error('Could not parse start of teiType', standOffProperty.teiType, error);
        }
      }

      // Sorting them by start & end property ruleset.
      startProperties.sort(AnnotationUtils.sortStartProperties);
      endProperties.sort(AnnotationUtils.sortEndProperties);

      // Parsing them into HTML context.
      const HTMLStartAnnotations: string[] = startProperties.map((property) => this.parseTeiType(property));
      const HTMLEndAnnotations: string[] = endProperties.map((property) => this.parseTeiType(property, true));
      const HTMLZeroPointAnnotations: string[] = zeroPointProperties.map((property) => this.parseZeroPoint(property));

      // Sorting them by HTML ruleset.
      HTMLStartAnnotations.sort(AnnotationUtils.sortHTMLStartAnnoations);
      HTMLEndAnnotations.sort(AnnotationUtils.sortHTMLEndAnnotations);

      this.annotatedText += HTMLStartAnnotations.filter((a) => a.length > 0).join('');
      this.annotatedText += HTMLZeroPointAnnotations.filter((a) => a.length > 0).join('');
      this.annotatedText += this.rawText[i];
      this.annotatedText += HTMLEndAnnotations.filter((a) => a.length > 0).join('');
    }

    return this.annotatedText;
  }

  protected parseTeiType(standOffProperty: IStandoffProperty, isClosing: boolean = false): string {
    let annotation: Annotation;

    switch (standOffProperty.teiType) {
      case 'l':
      case 'addrLine':
        return !isClosing ? '' : '<br />';
      case 'div':
        return !isClosing ? '<div>' : '</div>';
      case 'dateline':
      case 'address':
      case 'lg':
      case 'salute':
      case 'signed':
        annotation = AnnotationHandler.handleCustomParagraph(standOffProperty);
        break;
      case 'opener':
      case 'closer':
        return !isClosing ? `<div class="${standOffProperty.teiType}">` : '</div>';
      case 'item':
        return !isClosing ? '<li>' : '</li>';
      case 'list':
        return !isClosing ? '<ul>' : '</ul>';
      case 'table':
        return !isClosing ? '<table>' : '</table>';
      case 'row':
        return !isClosing ? '<tr>' : '</tr>';
      case 'abbr':
        annotation = AnnotationHandler.handleAbbr(standOffProperty);
        break;
      case 'add':
        annotation = AnnotationHandler.handleAdd(standOffProperty);
        break;
      case 'bibl':
        annotation = AnnotationHandler.handleBibl(standOffProperty);
        break;
      case 'cell':
        return AnnotationHandler.handleCell(standOffProperty, isClosing);
      case 'commented':
        annotation = AnnotationHandler.handleCommented(standOffProperty);
        break;
      case 'date':
        annotation = AnnotationHandler.handleDate(standOffProperty);
        break;
      case 'del':
        annotation = AnnotationHandler.handleDel(standOffProperty);
        break;
      case 'gap':
        annotation = AnnotationHandler.handleGap(standOffProperty);
        break;
      case 'head':
        return !isClosing ? "<h6 class='spo-headline'>" : '</h6>';
      case 'hi':
        annotation = AnnotationHandler.handleHi(standOffProperty);
        break;
      case 'name':
        annotation = AnnotationHandler.handleName(standOffProperty);
        break;
      case 'note':
        annotation = AnnotationHandler.handleNote(standOffProperty);
        break;
      case 'p':
        annotation = AnnotationHandler.handleParagraph(standOffProperty);
        break;
      case 'persName':
        annotation = AnnotationHandler.handlePersName(standOffProperty);
        break;
      case 'placeName':
        annotation = AnnotationHandler.handlePlace(standOffProperty);
        break;
      case 'postscript':
        annotation = AnnotationHandler.handlePostscript();
        break;
      case 'reg':
        annotation = AnnotationHandler.handleReg(standOffProperty);
        break;
      case 'rs':
        annotation = AnnotationHandler.handleRegisterEntry(standOffProperty);
        break;
      case 'sic':
        annotation = AnnotationHandler.handleSic(standOffProperty);
        break;
      case 'subst':
        annotation = AnnotationHandler.handleSubst();
        break;
      case 'supplied':
        annotation = AnnotationHandler.handleSupplied(standOffProperty);
        break;
      case 'unclear':
        annotation = AnnotationHandler.handleUnclear(standOffProperty);
        break;
      case 'ref':
        annotation = AnnotationHandler.handleRef(standOffProperty);
        break;
      case 'foreign':
      case 'comment':
        return '';
      case 'selection':
        annotation = AnnotationHandler.handleSelection(standOffProperty);
        break;
      default:
        console.error('Could not parse TEI type:', standOffProperty.teiType);
        return '';
    }

    annotation.guid = standOffProperty.guid;
    annotation.containment = this.parseContainment(annotation);

    this.handleAnnotationStack(annotation, isClosing);
    return this.getParsedHTMLContext(annotation, isClosing);
  }

  protected parseZeroPoint(standOffProperty: IStandoffProperty): string {
    let annotation: Annotation;

    switch (standOffProperty.teiType) {
      case 'lb':
        return '<br />';
      case 'pb':
        annotation = AnnotationHandler.handlePb(standOffProperty);
        break;
      default:
        console.error('Could not parse ZeroPoint TEI type:', standOffProperty.teiType);
        return '';
    }

    annotation.guid = standOffProperty.guid;
    annotation.containment = this.parseContainment(annotation);
    return this.getParsedZeroPointHTML(annotation);
  }

  protected parseContainment(annotation: Annotation): number {
    if (annotation.containment) return annotation.containment;
    switch (annotation.element) {
      case 'div':
        return 0;
      case 'p':
        return 1;
      case 'span':
        return 2;
      case 'a':
        return 3;
      default:
        return 99;
    }
  }

  private getParsedHTMLContext(annotation: Annotation, isClosing: boolean): string {
    const overlaps: Annotation[] = this.annotations.filter(
      (a: Annotation): boolean => a.element === annotation.element,
    );
    const containment: Annotation[] = this.annotations.filter(
      (a: Annotation): boolean => annotation.containment! < a.containment!,
    );

    if (containment.length > 0) return this.getContainmentHTML(annotation, containment, isClosing);
    if (overlaps.length > 0) return this.getOverlappedHTML(annotation, overlaps, isClosing);
    if (isClosing) return `</${annotation.element}>`;

    const attributeString: string = annotation.attributes.join(' ');
    const identifierString: string = annotation.identifier;
    return `<${annotation.element} class="${identifierString}" ${attributeString}>`;
  }

  private getOverlappedHTML(annotation: Annotation, overlaps: Annotation[], isClosing: boolean): string {
    const attributes: string[] = isClosing ? [] : [...annotation.attributes];
    const identifier: string[] = isClosing ? [] : [annotation.identifier];

    overlaps.forEach((annotation: Annotation): void => {
      const isCurrentIdentifier: boolean = identifier.includes(annotation.identifier);
      if (!isCurrentIdentifier) identifier.push(annotation.identifier);

      annotation.attributes.forEach((attr: string): void => {
        const isCurrentAttribute: boolean = attributes.includes(attr);
        if (!isCurrentAttribute) attributes.push(attr);
      });
    });

    const attributeString: string = attributes.join(' ');
    const identifierString: string = identifier.join(' ');
    return `</${annotation.element}><${annotation.element} class="${identifierString}" ${attributeString}>`;
  }

  private getContainmentHTML(annotation: Annotation, containment: Annotation[], isClosing: boolean): string {
    const reduced: Annotation[] = this.distinctAnnotations(containment);

    if (isClosing) {
      reduced.sort(AnnotationUtils.sortContainmentDesc);
      const elements: string[] = reduced.map((a: Annotation): string => `</${a.element}>`);
      const elementsString: string = elements.join(' ');
      return `${elementsString}</${annotation.element}>`;
    }

    reduced.sort(AnnotationUtils.sortContainmentAsc);
    const annotations: string[] = reduced.map((a: Annotation): string => {
      const identifierString: string = a.identifier;
      const attributeString: string = a.attributes.join(' ');
      return `<${a.element} class="${identifierString}" ${attributeString}>`;
    });

    const annotationsString: string = annotations.join(' ');
    const identifierString: string = annotation.identifier;
    const attributeString: string = annotation.attributes.join(' ');
    return `<${annotation.element} class="${identifierString}" ${attributeString}>${annotationsString}`;
  }

  private getParsedZeroPointHTML(annotation: Annotation): string {
    const attributeString: string = annotation.attributes.join(' ');
    const identifierString: string = annotation.identifier;
    const innerHTML: string = annotation.innerHTML ?? '';
    const annotationTag: string = `<${annotation.element} class="zpa ${identifierString}" ${attributeString}>${innerHTML}</${annotation.element}>`;

    if (this.annotations.length === 0) return annotationTag;

    const reduced: Annotation[] = this.distinctAnnotations(this.annotations).filter(
      (a: Annotation): boolean => a.element === annotation.element,
    );
    const elements: string[] = reduced.map((a: Annotation): string => `</${a.element}>`);
    const elementsString: string = elements.join(' ');

    const annotations: string[] = reduced.map((a: Annotation): string => {
      const identifierString: string = a.identifier;
      const attributeString: string = a.attributes.join(' ');
      return `<${a.element} class="${identifierString}" ${attributeString}>`;
    });

    const annotationsString: string = annotations.join(' ');
    return elementsString + annotationTag + annotationsString;
  }

  private handleAnnotationStack(annotation: Annotation, isClosing: boolean): void {
    if (isClosing) {
      const index: number = this.annotations.findIndex((a) => a.identifier === annotation.identifier);
      this.annotations.splice(index, 1);
    } else this.annotations.push(annotation);
  }

  private distinctAnnotations(annotation: Annotation[]): Annotation[] {
    return annotation.reduce((acc: Annotation[], curr: Annotation): Annotation[] => {
      const existingElement: Nullable<Annotation> = acc.find((a: Annotation): boolean => a.element == curr.element);

      if (existingElement) {
        existingElement.attributes = existingElement.attributes.concat(curr.attributes);
        existingElement.identifier += ' ' + curr.identifier;
      } else acc.push({ ...curr });

      return acc;
    }, []);
  }
}
