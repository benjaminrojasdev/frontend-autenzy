import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/components/header/header.component';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../shared/components/footer/footer.component';

@Component({
  selector: 'app-home2',
  imports: [HeaderComponent,CommonModule,FooterComponent],
  templateUrl: './home2.component.html',
  styleUrl: './home2.component.scss'
})
export class Home2Component {

}
