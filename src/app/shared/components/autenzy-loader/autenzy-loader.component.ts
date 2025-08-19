import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-autenzy-loader',
  imports: [CommonModule],
  templateUrl: './autenzy-loader.component.html',
  styleUrl: './autenzy-loader.component.scss'
})
export class AutenzyLoaderComponent {
  @Input() visible: boolean = false;
  @Input() inline: boolean = false;
}
