import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[appShowExtraImage]',
})
export class ShowExtraImageDirective {
  private extraImg?: HTMLElement;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    // Busca la imagen con clase "hidden-img" dentro del elemento
    this.extraImg = this.el.nativeElement.querySelector('.hidden-img');

    if (this.extraImg) {
      this.renderer.setStyle(this.extraImg, 'position', 'absolute');
      this.renderer.setStyle(this.extraImg, 'bottom', '-50px');
      this.renderer.setStyle(this.extraImg, 'right', '-50px');
      this.renderer.setStyle(this.extraImg, 'opacity', '0');
      this.renderer.setStyle(this.extraImg, 'transition', 'all 0.3s ease');
    }
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    if (!this.extraImg) return;
    this.renderer.setStyle(this.extraImg, 'bottom', '10px');
    this.renderer.setStyle(this.extraImg, 'right', '10px');
    this.renderer.setStyle(this.extraImg, 'opacity', '1');
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (!this.extraImg) return;
    this.renderer.setStyle(this.extraImg, 'bottom', '-50px');
    this.renderer.setStyle(this.extraImg, 'right', '-50px');
    this.renderer.setStyle(this.extraImg, 'opacity', '0');
  }
}
