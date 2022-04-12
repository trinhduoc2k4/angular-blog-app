import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appClickOutSide]'
})
export class ClickOutSideDirective {

  constructor(private ele: ElementRef) { }

  @HostListener('document:click', ['$event.target'])
  public handleClick(element: Element) {
    if (!element.closest('.navbar-mobile')) {
      const isContain = this.ele.nativeElement.contains(element);
      if (!isContain || element.closest('.nav-item')) {
        this.ele.nativeElement.classList.remove('active');
      }
    }
  }
}
