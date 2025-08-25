import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml',
  standalone: true, // Or declare in a module if not standalone
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(protected sanitizer: DomSanitizer) {}

  public transform(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
