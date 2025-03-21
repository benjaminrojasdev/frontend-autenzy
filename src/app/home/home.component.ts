import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button'; 
import { ProgressSpinnerModule } from 'primeng/progressspinner';


@Component({
  selector: 'app-home',
  imports: [ButtonModule,ProgressSpinnerModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  loading: boolean = false;

  load() {
      this.loading = true;

      setTimeout(() => {
          this.loading = false
      }, 2000);
  }
}
