import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { marked, MarkedExtension, Tokens } from 'marked';

@Component({
  selector: 'app-markdown-text',
  templateUrl: './markdown-view.component.html',
})
export class MarkdownViewComponent implements OnChanges {
  /**
   * rawMarkdown: defines the raw markdown text that can be inserted into this component.
   */
  @Input() rawMarkdown: string = '';

  public htmlText: string = '';

  constructor() {
    const renderer: MarkedExtension['renderer'] = {
      image(token: Tokens.Image): string {
        return `</p><p class="d-block-inline text-center markdown-paragraph">
            <img src="/assets/images/socinian/${token.href}" class="mt-4 img-fluid" alt="${token.text}" title="${token.title}" \>
          </span>
        </p><p class="markdown-paragraph">`;
      },

      link(token: Tokens.Link): string {
        return `<a href="${token.href}" target="blank">${token.text}</a>`;
      },

      heading(token: Tokens.Heading): string {
        const escapedText = token.text.toLowerCase().replace(/[^\w]+/g, '-');

        return `
            <h${token.depth} id="${escapedText}}" class="markdown-heading">
              ${token.text}
            </h${token.depth}>`;
      },

      paragraph(token: Tokens.Paragraph): string {
        return `<p class="markdown-paragraph">${token.text}</p>`;
      },
    };

    marked.use({ renderer });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['rawMarkdown']) {
      this.htmlText = marked.parse(this.rawMarkdown) as string;
    }
  }
}
