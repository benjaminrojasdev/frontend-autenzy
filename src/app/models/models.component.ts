import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../auth-service.service';
import { CommonModule } from '@angular/common';
import { BrandService } from '../services/brand.service';
import { HeaderComponent } from '../shared/components/header/header.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ListboxModule } from 'primeng/listbox';
import { DropdownModule } from 'primeng/dropdown';
import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { AutenzyLoaderComponent } from '../shared/components/autenzy-loader/autenzy-loader.component';
import { FooterComponent } from '../shared/components/footer/footer.component';

@Component({
  selector: 'app-models',
  imports: [CommonModule, HeaderComponent, AutoCompleteModule, FormsModule, HttpClientModule, ListboxModule, DropdownModule, AccordionModule, CardModule, SkeletonModule, AutenzyLoaderComponent, FooterComponent],
  templateUrl: './models.component.html',
  styleUrl: './models.component.scss'
})
export class ModelsComponent implements OnInit {
  brands: any[] = [];
  filteredBrands: any[] = [];
  selectedBrand: any;
  vehicleTypes: { label: string; value: string; icon: string }[] = [];
  vehiclesByType: { typeVehicle: string; models: any[] } | null = null;
  loadingModels = false;
  versionsMap: { [idDetail: number]: any[] } = {};
  selectedVersionMap: { [idDetail: number]: any } = {};
  dropdownOpen: { [idDetail: number]: boolean } = {};
  selectedVehicleType: any = null;
  showHeaderImage: boolean = true;
  hasInitialized: boolean = false;
  hasInteracted: boolean = false;
  loadingBrands = false;
  loadingVehicleTypes = false;



  constructor(
    private authService: AuthServiceService,
    private brandService: BrandService
  ) {
    this.loadingModels = false;
  }

  ngOnInit(): void {
    this.loadingModels = false;
    this.hasInitialized = true;
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      const token = sessionStorage.getItem('token');
      token ? this.loadBrands() : this.login();
    }
  }

  private login(): void {
    this.authService.login().subscribe({
      next: (res) => {
        try {
          sessionStorage.setItem('token', res.token);
          this.loadBrands();
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
  this.loadingBrands = true;
  this.brandService.getAllBrands().subscribe({
    next: (res) => {
      this.brands = res;
      this.loadingBrands = false;
    },
    error: () => {
      console.error('Error al obtener las marcas.');
      this.loadingBrands = false;
    }
  });
}

  search(event: any): void {
    const query = event.query.toLowerCase();
    this.filteredBrands = this.brands.filter(brand =>
      brand.name.toLowerCase().includes(query)
    );
  }

  getCountryCode(country: string): string {
    const map: Record<string, string> = {
      'Japón': 'jp',
      'Corea del Sur': 'kr',
      'Brasil': 'br',
      'Alemania': 'de',
      'Estados Unidos': 'us',
      'Italia': 'it',
      'Francia': 'fr',
      'Inglaterra': 'gb',
      'Suecia': 'se',
      'España': 'es',
      'China': 'cn'
    };
    return map[country] || 'un';
  }

  onBrandSelected(event: any): void {
  const brand = event.value;
  this.selectedVehicleType = null;
  this.vehiclesByType = null;
  this.loadingVehicleTypes = true;

  if (!brand?.id) {
    this.vehicleTypes = [];
    this.loadingVehicleTypes = false;
    return;
  }

  this.brandService.getVehiclesByBrand(brand.id).subscribe({
    next: (res) => {
      const types = [...new Set(res.map(v => v.nameType))];
      this.vehicleTypes = types.map((type: string) => ({
        label: type,
        value: type,
        icon: this.getVehicleIcon(type)
      }));
      this.loadingVehicleTypes = false;
    },
    error: (err) => {
      console.error('💥 Error al obtener vehículos:', err);
      this.vehicleTypes = [];
      this.loadingVehicleTypes = false;
    }
  });
}

  getVehicleIcon(type: string): string {
    const icons: Record<string, string> = {
      'Hatchback': '/hatchback.webp',
      'Sedan': '/sedancar.webp',
      'Suv': '/suv.webp',
      'Pickup': '/pickup.webp',
      'Crossover': 'assets/icons/crossover.svg',
      'Van': 'assets/icons/van.svg',
      'Coupe': 'coupe.webp',
      'Convertible': 'assets/icons/convertible.svg'
    };
    return icons[type] || 'assets/icons/default.svg';
  }

  onVehicleClick(type: string): void {
    const loaderStart = Date.now();

    if (!type || !this.selectedBrand) {
      console.warn('🚫 Debes seleccionar una marca y un tipo de vehículo');
      return;
    }

    const brandId = this.selectedBrand?.id;
    if (!brandId) {
      console.error('Marca no seleccionada');
      return;
    }

    this.showHeaderImage = false;
    this.vehiclesByType = null;
    this.versionsMap = {};
    this.hasInteracted = true;
    this.loadingModels = true;

    let pendingVersions = 0;

    const endLoadingAfterMinimum = () => {
      const elapsed = Date.now() - loaderStart;
      const remaining = Math.max(0, 3000 - elapsed); // mínimo 3 segundos
      console.log(`[loader] esperando ${remaining}ms más para completar 3s...`);

      setTimeout(() => {
        this.loadingModels = false;
        console.log('[loader] ocultado después del tiempo mínimo');
      }, remaining);
    };

    const tryFinishLoading = () => {
      if (pendingVersions === 0) {
        endLoadingAfterMinimum();
      }
    };

    this.brandService.getVehiclesByBrand(brandId).subscribe({
      next: (res) => {
        const vehicleMatch = res.find(v => v.nameType === type);
        if (!vehicleMatch || vehicleMatch.idVehicle === undefined) {
          console.error('Tipo de vehículo no encontrado o sin idVehicle');
          tryFinishLoading();
          return;
        }

        const typeId = vehicleMatch.idVehicle;

        this.brandService.getVehiclesByBrandAndType(brandId, typeId).subscribe({
          next: (response) => {
            this.vehiclesByType = response;

            response.models.forEach((model: any) => {
              model.details.forEach((detail: any) => {
                const id = detail.idDetails;
                if (id !== undefined && id !== null && !this.versionsMap[id]) {
                  pendingVersions++; // 👈 sumamos 1 pendiente

                  this.brandService.getVersionsByDetailId(id).subscribe({
                    next: (versions) => {
                      this.versionsMap[id] = versions;
                      pendingVersions--;
                      tryFinishLoading(); // 👈 revisamos si ya terminó todo
                    },
                    error: (err) => {
                      console.error(`❌ Error cargando versiones para idDetail ${id}:`, err);
                      pendingVersions--;
                      tryFinishLoading();
                    }
                  });
                }
              });
            });

            // En caso de que no se hayan solicitado versiones
            tryFinishLoading();
          },
          error: (error) => {
            console.error('💥 Error al obtener vehículos por tipo:', error);
            tryFinishLoading();
          }
        });
      },
      error: (err) => {
        console.error('💥 Error al obtener las marcas:', err);
        tryFinishLoading();
      }
    });
  }

  selectVersion(idDetail: number, version: any): void {
    this.selectedVersionMap[idDetail] = version;
  }

  getUniqueValues(arr: any[], key: string): string {
    const values = Array.from(new Set(arr.map(item => item[key])));
    return values.join(' - ');
  }

  onSelectedBrandChange(brand: any): void {
    this.selectedBrand = brand;
  }

  toggleDropdown(idDetail: number): void {
    this.dropdownOpen[idDetail] = !this.dropdownOpen[idDetail];
  }

  onClearBrand(): void {
  this.selectedBrand = null;
  this.selectedVehicleType = null;
  this.vehicleTypes = [];
  this.vehiclesByType = null;
  this.showHeaderImage = true;
}

}