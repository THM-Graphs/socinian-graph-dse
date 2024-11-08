import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { marked, RendererObject, Tokens } from 'marked';
import { Nullable } from '../../../../global.js';

@Component({
  selector: 'app-markdown-text',
  templateUrl: './markdown-view.component.html',
})
export class MarkdownViewComponent implements OnChanges {
  @Input() rawMarkdown: Nullable<string> = '';
  public parsedHTML: string = '';

  constructor() {
    const renderer: RendererObject = {
      image(token: Tokens.Image): string {
        return `
            </p><p class="d-block-inline text-center markdown-paragraph">
                <img src="/markdown/${token.href}" class="mt-4 img-fluid" alt="${token.text}" title="${token.title}" \>
            </p><p class="markdown-paragraph">`;
      },

      link(token: Tokens.Link): string {
        return `<a href="${token.href}" target="blank">${token.text}</a>`;
      },

      heading(token: Tokens.Heading): string {
        const escapedText: string = token.text.toLowerCase().replace(/[^\w]+/g, '-');

        return `
            <h${token.depth} id="${escapedText}}" class="markdown-heading">
              ${token.text}
            </h${token.depth}>`;
      },

      paragraph(token: Tokens.Paragraph): string {
        return `<p class="markdown-paragraph">${this.parser.parseInline(token.tokens)}</p>`;
      },
    };

    marked.use({ renderer });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['rawMarkdown']) {
      this.parsedHTML = marked.parse(this.rawMarkdown ?? '') as string;
    }
  }
}
