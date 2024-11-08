import { IStandoffProperty } from 'src/app/models/IStandoffProperty';
import { SocinianUtils } from '../SocinianUtils';
import { Annotation } from './AnnotationParser';

export default class AnnotationHandler {
  public static handleAbbr(standOffProperty: IStandoffProperty): Annotation {
    const data: { expansion: string } = JSON.parse(standOffProperty.data);
    return {
      element: 'span',
      attributes: [`data-abbr="${data.expansion}"`],
      identifier: 'abbr',
    };
  }

  public static handleRef(standOffProperty: IStandoffProperty): Annotation {
    const data: { target: string } = JSON.parse(standOffProperty.data);
    return {
      element: 'a',
      attributes: [`href="${data.target}" target="_blank"`],
      identifier: 'ref',
    };
  }

  public static handleAdd(standOffProperty: IStandoffProperty): Annotation {
    const data: { place: string } = JSON.parse(standOffProperty.data);
    return {
      element: 'span',
      attributes: [`data-add-place="${data.place}"`],
      identifier: 'add',
    };
  }

  public static handleBibl(standOffProperty: IStandoffProperty): Annotation {
    const data: { sameAs?: string; teiType?: string } = JSON.parse(standOffProperty.data);
    return {
      element: 'a',
      attributes: [`href="${data.sameAs}" target="_blank"`],
      identifier: 'bibl',
    };
  }

  public static handleCell(standOffProperty: IStandoffProperty, isClosing: boolean): string {
    const data: { cols?: string } = JSON.parse(standOffProperty.data);
    if (!data.cols) return !isClosing ? '<td>' : '</td>';
    return !isClosing ? `<td colspan="${data.cols}">` : '</td>';
  }

  public static handleCommented(standOffProperty: IStandoffProperty): Annotation {
    return {
      element: 'span',
      attributes: [`data-comment-id="${standOffProperty.guid}"`],
      identifier: 'commented',
    };
  }

  public static handleDate(standOffProperty: IStandoffProperty): Annotation {
    const data: { calendar: string } = JSON.parse(standOffProperty.data);
    const parsedCalendar: string = SocinianUtils.translateCalendar(data.calendar);
    return {
      element: 'span',
      attributes: [`data-calendar="${parsedCalendar}"`],
      identifier: 'date',
    };
  }

  public static handleDel(standOffProperty: IStandoffProperty): Annotation {
    const data: { rendition: string } = JSON.parse(standOffProperty.data);
    return {
      element: 'span',
      attributes: [`data-del-rendition="${data.rendition}"`],
      identifier: 'del',
    };
  }

  public static handleHead(standOffProperty: IStandoffProperty): Annotation {
    return {
      element: 'h6',
      attributes: [],
      identifier: 'spo-headline',
    };
  }

  public static handleGap(standOffProperty: IStandoffProperty): Annotation {
    const data: { quantity: string; reason: string; unit: string } = JSON.parse(standOffProperty.data);
    return {
      element: 'span',
      attributes: [`data-quantity="${data.quantity}"`, `data-reason="${data.reason}"`, `data-unit="${data.unit}"`],
      identifier: 'gap',
    };
  }

  public static handleHi(standOffProperty: IStandoffProperty): Annotation {
    const data: { rendition: string } = JSON.parse(standOffProperty.data);
    const renditions: string[] = data.rendition.split(' ');
    const identifier: string[] = [];

    const renditionMapping: { rendition: string; class: string }[] = [
      { rendition: '#aq', class: 'font-antiqua' },
      { rendition: '#b', class: 'font-weight-bold' },
      { rendition: '#fr', class: 'font-opensans' },
      { rendition: '#g', class: 'lock-pressure' },
      { rendition: '#i', class: 'font-italic' },
      { rendition: '#k', class: 'small-caps' },
      { rendition: '#u', class: 'text-decoration-underline' },
    ];

    for (const rendition of renditions) {
      const renditionClass: string | undefined = renditionMapping.find((r) => r.rendition === rendition)?.class;
      if (renditionClass) identifier.push(renditionClass);
    }

    return {
      element: data.rendition.includes('#sup') ? 'sup' : 'span',
      attributes: [],
      identifier: identifier.join(' '),
    };
  }

  public static handleName(standOffProperty: IStandoffProperty): Annotation {
    const data: { type: string } = JSON.parse(standOffProperty.data);
    return {
      element: 'span',
      attributes: [`data-register-id="${standOffProperty.guid}"`, `data-register-type="${data.type}"`],
      identifier: 'custom-entry term',
    };
  }

  public static handleNote(standOffProperty: IStandoffProperty): Annotation {
    const data: { hand: string; place: string } = JSON.parse(standOffProperty.data);
    return {
      element: 'span',
      attributes: [`data-note-hand="${data.hand}"`, `data-note-placement="${data.place}"`],
      identifier: 'note',
    };
  }

  public static handleParagraph(standOffProperty: IStandoffProperty): Annotation {
    const data: { rendition: string } = JSON.parse(standOffProperty.data);
    return {
      element: 'p',
      attributes: [`data-start="${standOffProperty.startIndex}"`],
      identifier: data.rendition === '#et' ? 'ps-5' : 'paragraph',
    };
  }

  public static handleCustomParagraph(standOffProperty: IStandoffProperty): Annotation {
    return {
      element: 'p',
      attributes: [`data-start="${standOffProperty.startIndex}"`],
      identifier: standOffProperty.teiType,
    };
  }

  public static handlePb(standOffProperty: IStandoffProperty): Annotation {
    const data: { facs: string; n: string } = JSON.parse(standOffProperty.data);
    const href: string = data.facs ? `href="${data.facs}" target="_blank"` : '';

    return {
      element: 'span',
      attributes: [],
      identifier: 'pb d-block user-select-none',
      innerHTML: `[ <a ${href}>${data.n}</a> ]`,
    };
  }

  public static handlePersName(standOffProperty: IStandoffProperty): Annotation {
    return {
      element: 'span',
      attributes: [`data-register-id="${standOffProperty.guid}"`, `data-register-type="person"`],
      identifier: 'custom-entry person',
    };
  }

  public static handlePlace(standOffProperty: IStandoffProperty): Annotation {
    return {
      element: 'span',
      attributes: [`data-register-id="${standOffProperty.guid}"`, `data-register-type="place"`],
      identifier: 'custom-entry place',
    };
  }

  public static handlePostscript(): Annotation {
    return {
      element: 'span',
      attributes: [],
      identifier: 'post-script',
    };
  }

  public static handleSelection(standOffProperty: IStandoffProperty): Annotation {
    return {
      element: 'span',
      attributes: [],
      identifier: 'selection',
    };
  }

  public static handleReg(standOffProperty: IStandoffProperty): Annotation {
    const data: { regularisation: string } = JSON.parse(standOffProperty.data);
    return {
      element: 'span',
      attributes: [`data-regularisation="${data.regularisation}"`],
      identifier: 'reg',
    };
  }

  public static handleRegisterEntry(standOffProperty: IStandoffProperty): Annotation {
    const data: { type: string } = JSON.parse(standOffProperty.data);
    return {
      element: 'span',
      attributes: [`data-register-id="${standOffProperty.guid}"`, `data-register-type="${data.type}"`],
      identifier: `register-entry ${data.type}`,
    };
  }

  public static handleSic(standOffProperty: IStandoffProperty): Annotation {
    const data: { correction: string; certainty: string } = JSON.parse(standOffProperty.data);
    return {
      element: 'span',
      attributes: [`data-correction="${data.correction}"`, `data-certainty="${data.certainty}"`],
      identifier: 'sic',
    };
  }

  public static handleSupplied(standOffProperty: IStandoffProperty): Annotation {
    const data: { cert: string } = JSON.parse(standOffProperty.data);
    return {
      element: 'span',
      attributes: [`data-cert="${data.cert}"`],
      identifier: 'supplied',
    };
  }

  public static handleSubst(): Annotation {
    return {
      element: 'span',
      attributes: [],
      identifier: 'substitute',
    };
  }

  public static handleUnclear(standOffProperty: IStandoffProperty): Annotation {
    const data: { cert: string; reason: string } = JSON.parse(standOffProperty.data);
    return {
      element: 'span',
      attributes: [`data-cert="${data.cert}"`, `data-reason="${data.reason}"`],
      identifier: 'unclear',
    };
  }
}
