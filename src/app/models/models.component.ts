import { AfterViewInit, Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AuthServiceService } from '../auth-service.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { BrandService } from '../services/brand.service';

@Component({
  selector: 'app-models',
  imports: [CommonModule],
  templateUrl: './models.component.html',
  styleUrl: './models.component.scss'
})
export class ModelsComponent implements OnInit {
  brands: any[] = [];

  constructor(
    private authService: AuthServiceService,
    private brandService: BrandService
  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      this.login();
    }
  }

  private login(): void {
    this.authService.login().subscribe({
      next: (res) => {
        try {
          sessionStorage.setItem('token', res.token);
          this.loadBrands(); // 👈 Carga las marcas solo después del login
        } catch (e) {
          console.warn('No se pudo guardar el token en sessionStorage:', e);
        }
      },
      error: () => {
        console.error('Error al iniciar sesión.');
      }
    });
  }

  private loadBrands(): void {
    this.brandService.getAllBrands().subscribe({
      next: (res) => {
        this.brands = res;
      },
      error: () => {
        console.error('Error al obtener las marcas.');
      }
    });
  }
}
