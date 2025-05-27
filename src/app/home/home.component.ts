import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';


@Component({
  selector: 'app-home',
  imports: [ButtonModule, ProgressSpinnerModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {


  loading: boolean = false;
  loading2: boolean = false;

  constructor(private router: Router) { }

  load() {
    this.loading = true;

    setTimeout(() => {
      this.loading = false
    }, 2000);
  }

  load2() {
    this.loading2 = true;

    setTimeout(() => {
      this.loading2 = false
    }, 2000);
  }

  navigateToModels(): void {
    this.loading = true;
    setTimeout(() => {
      this.router.navigate(['/modelos']);
    }, 500); // tiempo simulado de espera
  }

  navigateToComparator(): void {
    this.loading2 = true;
    setTimeout(() => {
      this.router.navigate(['/comparador']);
    }, 500); //
  }
}