import { IStandoffProperty } from 'src/app/models/IStandoffProperty';
import { Annotation } from './AnnotationParser';

export default class AnnotationUtils {
  public static sortHTMLStartAnnoations(a: string, b: string): number {
    const HTMLStartingHierarchy: string[] = ['<div', '<p', '<tr', '<td', '<span', '<sub', '<h6'];

    for (const element of HTMLStartingHierarchy) {
      if (a.includes(element) && b.includes(element)) return 0;
      if (a.includes(element)) return -1;
      if (b.includes(element)) return 1;
    }
    return -1;
  }

  public static sortHTMLEndAnnotations(a: string, b: string): number {
    const HTMLClosingHierarchy: string[] = ['</div', '</p', '</tr', '</td', '</span', '</sub', '</h6'];

    for (const element of HTMLClosingHierarchy) {
      if (a.includes(element) && b.includes(element)) return 0;
      if (a.includes(element)) return -1;
      if (b.includes(element)) return 1;
    }
    return -1;
  }

  public static sortStartProperties(a: IStandoffProperty, b: IStandoffProperty): number {
    return a.startIndex - b.startIndex;
  }

  public static sortEndProperties(a: IStandoffProperty, b: IStandoffProperty): number {
    return b.endIndex - a.endIndex;
  }

  public static sortContainmentDesc(a: Annotation, b: Annotation): number {
    return b.containment! - a.containment!;
  }

  public static sortContainmentAsc(a: Annotation, b: Annotation): number {
    return a.containment! - b.containment!;
  }
}
