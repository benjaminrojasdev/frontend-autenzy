import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/components/header/header.component';
import { FooterComponent } from '../shared/components/footer/footer.component';

@Component({
  selector: 'app-politics',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './politics.component.html',
  styleUrl: './politics.component.scss'
})
export class PoliticsComponent {

}
