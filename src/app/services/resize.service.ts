import { inject, Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ResizeService {
  private breakpointObserver: BreakpointObserver = inject(BreakpointObserver);

  isHandset$ = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map((result) => result.matches));
  isTablet$ = this.breakpointObserver
    .observe(Breakpoints.Tablet)
    .pipe(map((result) => result.matches));
  isWeb$ = this.breakpointObserver
    .observe('(min-width: 840px)')
    .pipe(map((result) => result.matches));
}
