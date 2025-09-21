import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  imports: [CommonModule],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {
  @Input() message: string = '';
  @Input() isOpen: boolean = false;

  close(): void {
    this.isOpen = false;
  }
}
