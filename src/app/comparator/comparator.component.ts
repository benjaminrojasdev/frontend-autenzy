import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../shared/components/header/header.component';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { BrandService } from '../services/brand.service';
import { AuthServiceService } from '../auth-service.service';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'app-comparator',
  imports: [HeaderComponent, DropdownModule, FormsModule, CommonModule, ChartModule, FooterComponent,CarouselModule],
  templateUrl: './comparator.component.html',
  styleUrl: './comparator.component.scss'
})
export class ComparatorComponent implements OnInit {
  token: string | null = null;
  comparaciones: { campo: string, resultado: 'A' | 'B' | 'empate' }[] = [];
  categoriaSeleccionada = '';
  categorias = [
    { label: 'Performance', value: 'performance' },
    { label: 'Comfort', value: 'comfort' },
    { label: 'Eficiencia', value: 'eficiencia' }
  ];

  comparacionesGanadas: string[] = [];
  puntosGanador: number = 0;
  nombreGanador: string = '';
  respuestaIA: string = '';
  textoAnimado: string = '';
  loadingIA: boolean = false;

  labelAnimado: string = '';
  private labelFinal = 'Generado por Autenzy AI';

  brandsA: any[] = [];
  brandsB: any[] = [];
  modelsA: any[] = [];
  modelsB: any[] = [];
  detailsA: any[] = [];
  detailsB: any[] = [];
  versionsA: any[] = [];
  versionsB: any[] = [];
  topComparisons: any[] = [];

  chartData: any;
  chartOptions: any;


  selectedBrandA: any;
  selectedModelA: any;
  selectedDetailA: any;
  selectedVersionA: any;

  selectedBrandB: any;
  selectedModelB: any;
  selectedDetailB: any;
  selectedVersionB: any;


  isExpandedA: boolean = false;
  isExpandedB: boolean = false;

  loadingBrandsA = false;
  loadingModelsA = false;
  loadingDetailsA = false;
  loadingVersionsA = false;

  loadingBrandsB = false;
  loadingModelsB = false;
  loadingDetailsB = false;
  loadingVersionsB = false;

  camposPrincipales: string[] = [];
  defaultCamposPrincipales: string[] = ['engine', 'transmission', 'drivertrain'];

  constructor(
    private brandService: BrandService,
    private authService: AuthServiceService
  ) { }

  ngOnInit(): void {
    this.token = sessionStorage.getItem('token');
    this.token ? this.loadBrands() : this.login();
    if (this.selectedVersionA && this.selectedVersionB) {
      this.compararCategoria();
    }
  }

  private login(): void {
    this.authService.login().subscribe({
      next: (res) => {
        sessionStorage.setItem('token', res.token);
        this.token = res.token;
        this.loadBrands();
      },
      error: () => {
        console.error('Error al iniciar sesión');
      }
    });
  }

private loadBrands(): void {
  this.brandService.getAllBrands().subscribe({
    next: (res) => {
      this.brandsA = [...res];
      this.brandsB = [...res];

      this.brandService.getTopComparisons().subscribe({
        next: (data) => {
          this.topComparisons = data.map((item, idx) => ({ ...item, index: idx }));
        },
        error: (err) => {
          console.error('Error al obtener comparaciones populares:', err);
        }
      });
    },
    error: () => {
      console.error('Error al obtener marcas');
    }
  });
}



  // --- Auto A ---
  onBrandChangeA(): void {
    this.modelsA = [];
    this.detailsA = [];
    this.versionsA = [];
    this.selectedModelA = null;
    this.selectedDetailA = null;
    this.selectedVersionA = null;

    if (this.selectedBrandA?.id) {
      this.loadingModelsA = true;
      this.brandService.getModelsByBrandId(this.selectedBrandA.id).subscribe({
        next: (res) => {
          this.modelsA = res;
          this.loadingModelsA = false;
        },
        error: () => {
          this.loadingModelsA = false;
        }
      });
    }
  }

  onModelChangeA(): void {
    this.detailsA = [];
    this.versionsA = [];
    this.selectedDetailA = null;
    this.selectedVersionA = null;

    if (this.selectedModelA?.id) {
      this.loadingDetailsA = true;
      this.brandService.getDetailsByModelId(this.selectedModelA.id).subscribe({
        next: (res) => {
          this.detailsA = res.map((d: any) => ({
            ...d,
            label: `${d.yearStart} - ${d.yearEnd}`,
            value: d.idDetails
          }));
          this.loadingDetailsA = false;
        },
        error: () => {
          this.loadingDetailsA = false;
        }
      });
    }
  }

  onDetailChangeA(): void {
    this.versionsA = [];
    this.selectedVersionA = null;

    if (this.selectedDetailA) {
      this.loadingVersionsA = true;

      this.brandService.getFullVersionsByDetailId(this.selectedDetailA.value).subscribe({
        next: (res) => {
          this.versionsA = res;
          this.loadingVersionsA = false;

          if (this.selectedVersionB) {
            this.compararCategoria();
          }
        },
        error: () => {
          this.loadingVersionsA = false;
        }
      });
    }
  }

  // --- Auto B ---
  onBrandChangeB(): void {
    this.modelsB = [];
    this.detailsB = [];
    this.versionsB = [];
    this.selectedModelB = null;
    this.selectedDetailB = null;
    this.selectedVersionB = null;

    if (this.selectedBrandB?.id) {
      this.loadingModelsB = true;
      this.brandService.getModelsByBrandId(this.selectedBrandB.id).subscribe({
        next: (res) => {
          this.modelsB = res;
          this.loadingModelsB = false;
        },
        error: () => {
          this.loadingModelsB = false;
        }
      });
    }
  }

  onModelChangeB(): void {
    this.detailsB = [];
    this.versionsB = [];
    this.selectedDetailB = null;
    this.selectedVersionB = null;

    if (this.selectedModelB?.id) {
      this.loadingDetailsB = true;
      this.brandService.getDetailsByModelId(this.selectedModelB.id).subscribe({
        next: (res) => {
          this.detailsB = res.map((d: any) => ({
            ...d,
            label: `${d.yearStart} - ${d.yearEnd}`,
            value: d.idDetails
          }));
          this.loadingDetailsB = false;
        },
        error: () => {
          this.loadingDetailsB = false;
        }
      });
    }
  }

  onDetailChangeB(): void {
    this.versionsB = [];
    this.selectedVersionB = null;

    if (this.selectedDetailB) {
      this.loadingVersionsB = true;

      this.brandService.getFullVersionsByDetailId(this.selectedDetailB.value).subscribe({
        next: (res) => {
          this.versionsB = res;
          this.loadingVersionsB = false;

          if (this.selectedVersionA) {
            this.compararCategoria();
          }
        },
        error: () => {
          this.loadingVersionsB = false;
        }
      });
    }
  }
  onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'https://via.placeholder.com/300x200?text=Imagen+no+disponible';
  }


  getCategoriaIcon(): string {
    switch (this.categoriaSeleccionada) {
      case 'performance':
        return '/turbo.webp';
      case 'comfort':
        return '/amortiguador.webp';
      case 'eficiencia':
        return '/bencina.webp';
      default:
        return '/info.webp';
    }
  }


  getCountryCode(country: string): string {
    const map: Record<string, string> = {
      'Argentina': 'ar',
      'Australia': 'au',
      'Austria': 'at',
      'Brasil': 'br',
      'Canadá': 'ca',
      'China': 'cn',
      'Corea del Sur': 'kr',
      'España': 'es',
      'Estados Unidos': 'us',
      'Francia': 'fr',
      'India': 'in',
      'Indonesia': 'id',
      'Italia': 'it',
      'Japón': 'jp',
      'Malasia': 'my',
      'México': 'mx',
      'Reino Unido': 'gb',
      'República Checa': 'cz',
      'Rusia': 'ru',
      'Sudáfrica': 'za',
      'Suecia': 'se',
      'Tailandia': 'th',
      'Turquía': 'tr',
      'Vietnam': 'vn'
    };
    return map[country] || 'un'; // 'un' = bandera por defecto
  }


  compararCategoria(): void {
    if (!this.selectedVersionA || !this.selectedVersionB || !this.categoriaSeleccionada) {
      this.comparaciones = [];
      this.comparacionesGanadas = [];
      this.puntosGanador = 0;
      this.nombreGanador = '';
      this.camposPrincipales = [];
      this.respuestaIA = '';
      return;
    }
  
    const A = this.selectedVersionA;
    const B = this.selectedVersionB;
  
    const comparar = (
      campo: string,
      tipo: 'mayor' | 'menor'
    ): { campo: string; resultado: 'A' | 'B' | 'empate' } => {
      const valA = parseFloat(A[campo]);
      const valB = parseFloat(B[campo]);
  
      if (isNaN(valA) || isNaN(valB)) return { campo, resultado: 'empate' };
      if (valA === valB) return { campo, resultado: 'empate' };
  
      const mejorEsA = tipo === 'mayor' ? valA > valB : valA < valB;
      return { campo, resultado: mejorEsA ? 'A' : 'B' };
    };
  
    switch (this.categoriaSeleccionada) {
      case 'performance':
        this.comparaciones = [
          comparar('power', 'mayor'),
          comparar('torque', 'mayor'),
          comparar('acceleration', 'menor'),
          comparar('weight', 'menor'),
          this.compararDrivertrain() // ✅ comparación especial por prioridad
        ];
        this.camposPrincipales = ['power', 'torque', 'acceleration', 'weight', 'drivertrain'];
        break;
  
      case 'comfort':
        this.comparaciones = [
          comparar('wheels', 'mayor'),
          comparar('lenght', 'mayor'),
          comparar('trunk_capacity', 'mayor')
        ];
        this.camposPrincipales = ['wheels', 'lenght', 'trunk_capacity'];
        break;
  
      case 'eficiencia':
        this.comparaciones = [
          comparar('consumption', 'mayor'),
          comparar('weight', 'menor'),
          comparar('displacement', 'menor')
        ];
        this.camposPrincipales = ['consumption', 'weight', 'displacement'];
        break;
  
      default:
        this.comparaciones = [];
        this.camposPrincipales = [];
        return;
    }
  
    this.isExpandedA = false;
    this.isExpandedB = false;
  
    let puntosA = 0;
    let puntosB = 0;
  
    this.comparaciones.forEach((c) => {
      if (c.resultado === 'A') puntosA++;
      else if (c.resultado === 'B') puntosB++;
      else if (c.resultado === 'empate') {
        puntosA++;
        puntosB++;
      }
    });
  
    const ganador = puntosA > puntosB ? 'A' : puntosB > puntosA ? 'B' : 'empate';
  
    this.comparacionesGanadas = this.comparaciones
      .filter(c => c.resultado === ganador)
      .map(c => c.campo);
  
    this.puntosGanador = ganador === 'A' ? puntosA : puntosB;
    this.nombreGanador =
      ganador === 'A'
        ? `${this.selectedBrandA?.name} ${this.selectedModelA?.name}`
        : ganador === 'B'
          ? `${this.selectedBrandB?.name} ${this.selectedModelB?.name}`
          : 'Empate';
  
    this.updateChart(puntosA, puntosB);
  
    const prompt = this.armarPrompt();
    console.log('📝 PROMPT PARA IA:\n', prompt);
  
    this.loadingIA = true;
    this.brandService.postOpinionArtificialIntelligence(prompt).subscribe({
      next: (res) => {
        this.respuestaIA = res.respuesta;
        this.textoAnimado = '';
        this.animarTexto(res.respuesta);
        this.loadingIA = false;
      },
      error: (err) => {
        this.respuestaIA = 'No se pudo generar el veredicto.';
        this.textoAnimado = this.respuestaIA;
        this.loadingIA = false;
        console.error('Error al obtener dictamen IA:', err);
      }
    });
  }

  compararDrivertrain(): { campo: string; resultado: 'A' | 'B' | 'empate' } {
    const prioridad: Record<string, number> = {
      'All wheel drive': 3,
      'Trasera': 2,
      'Delantera': 1,
      '4x4': 0
    };
  
    const valA = prioridad[this.selectedVersionA.drivertrain] || 0;
    const valB = prioridad[this.selectedVersionB.drivertrain] || 0;
  
    if (valA === valB) return { campo: 'drivertrain', resultado: 'empate' };
    return {
      campo: 'drivertrain',
      resultado: valA > valB ? 'A' : 'B'
    };
  }

  getResultadoComparacion(campo: string): 'A' | 'B' | 'empate' | null {
    const resultado = this.comparaciones.find(c => c.campo === campo);
    return resultado?.resultado ?? null;
  }

  getCampoLabel(campo: string): string {
    const labels: Record<string, string> = {
      power: 'Caballos de fuerza',
      torque: 'Torque',
      engine: 'Motor',
      acceleration: 'Aceleración',
      wheels: 'Llantas',
      lenght: 'Largo',
      trunk_capacity: 'Maletero',
      consumption: 'Consumo',
      weight: 'Peso',
      displacement: 'Cilindrada',
      drivertrain: 'Tracción'
    };
    return labels[campo] || campo;
  }



  updateChart(puntosA: number, puntosB: number): void {
    const ganadorEsA = puntosA > puntosB;
    const colorGanador = '#00b386';
    const colorPerdedor = '#4C4862';

    const backgroundColors = ganadorEsA
      ? [colorGanador + '66', colorPerdedor + '66'] // 66 = opacidad aprox 40%
      : [colorPerdedor + '66', colorGanador + '66'];

    const borderColors = ganadorEsA
      ? [colorGanador, colorPerdedor]
      : [colorPerdedor, colorGanador];

    this.chartData = {
      labels: [
        `${this.selectedBrandA?.name} ${this.selectedModelA?.name}`,
        `${this.selectedBrandB?.name} ${this.selectedModelB?.name}`,
      ],
      datasets: [
        {
          label: 'Puntaje',
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 2,
          borderRadius: 8,
          data: [puntosA, puntosB]
        }
      ]
    };

    this.chartOptions = {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 20,
          bottom: 20,
          left: 15,
          right: 15
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#4C4862',
          titleColor: '#fff',
          bodyColor: '#fff',
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: {
            drawOnChartArea: false,
            drawTicks: false
          },
          ticks: {
            color: '#666'
          }
        },
        y: {
          ticks: {
            color: '#4C4862',
            font: { weight: '600' }
          },
          grid: {
            display: false
          }
        }
      }
    };
  }

  esCampoPrincipal(campo: string): boolean {
    if (this.camposPrincipales.length > 0) {
      return this.camposPrincipales.includes(campo);
    }
    return this.defaultCamposPrincipales.includes(campo);
  }

  get siguienteCampoA(): string | null {
    if (!this.selectedVersionA || !this.camposPrincipales.length) return null;

    const todosLosCampos = [
      'engine', 'transmission', 'drivertrain', 'power', 'torque',
      'acceleration', 'wheels', 'lenght', 'consumption',
      'weight', 'displacement', 'cylinderConfiguration', 'induction',
      'trunk_capacity'
    ];

    return todosLosCampos.find(campo =>
      !this.camposPrincipales.includes(campo)
    ) || null;
  }

  get siguienteCampoB(): string | null {
    if (!this.selectedVersionB || !this.camposPrincipales.length) return null;

    const todosLosCampos = [
      'engine', 'transmission', 'drivertrain', 'power', 'torque',
      'acceleration', 'wheels', 'lenght', 'consumption',
      'weight', 'displacement', 'cylinderConfiguration', 'induction',
      'trunk_capacity'
    ];

    return todosLosCampos.find(campo =>
      !this.camposPrincipales.includes(campo)
    ) || null;
  }


  armarPrompt(): string {
    const A = this.selectedVersionA;
    const B = this.selectedVersionB;

    const nombreA = `${this.selectedBrandA.name} ${this.selectedModelA.name}`;
    const nombreB = `${this.selectedBrandB.name} ${this.selectedModelB.name}`;
    const categoria = this.categorias.find(c => c.value === this.categoriaSeleccionada)?.label || this.categoriaSeleccionada;

    const fichaAuto = (
      nombre: string,
      datos: any,
      modelo: any,
      origen: string
    ): string => `${nombre}
  Marca: ${nombre.split(' ')[0]}, Modelo: ${this.getValor(modelo?.name)}, Año: ${this.getValor(this.selectedDetailA.label)}, Versión: ${this.getValor(datos.name)}, Origen: ${this.getValor(origen)}, Motor: ${this.getValor(datos.engine)}, Transmisión: ${this.getValor(datos.transmission)}, Tracción: ${this.getValor(datos.drivertrain)}, Caballos de fuerza: ${this.getValor(datos.power)} HP, Torque: ${this.getValor(datos.torque)} NM, 0-100 Km/h: ${this.getValor(datos.acceleration)} s, Llantas: ${this.getValor(datos.wheels)}, Dimensiones: ${this.getValor(datos.lenght)} / ${this.getValor(datos.width)} / ${this.getValor(datos.height)} mm, Consumo: ${this.getValor(datos.consumption)} km/L, Peso: ${this.getValor(datos.weight)} kg, Cilindrada: ${this.getValor(datos.displacement)}, Cilindros: ${this.getValor(datos.cylinderConfiguration)}, Inducción: ${this.getValor(datos.induction)}, Maletero: ${this.getValor(datos.trunk_capacity)} L`;

    const camposGanados = this.comparaciones
      .filter(c => c.resultado === (this.nombreGanador === nombreA ? 'A' : 'B'))
      .map(c => this.getCampoLabel(c.campo));

    const camposPerdidos = this.comparaciones
      .filter(c => {
        if (this.nombreGanador === 'Empate') return false;
        return c.resultado === (this.nombreGanador === nombreA ? 'B' : 'A');
      })
      .map(c => this.getCampoLabel(c.campo));

    const camposEmpatados = this.comparaciones
      .filter(c => c.resultado === 'empate')
      .map(c => this.getCampoLabel(c.campo));

    let promptFinal = (
      `${fichaAuto(nombreA, A, this.selectedModelA, this.selectedDetailA.origin)}\n\n` +
      `${fichaAuto(nombreB, B, this.selectedModelB, this.selectedDetailB.origin)}\n\n` +
      `Categoría: ${categoria}\n` +
      `Ganador: ${this.nombreGanador}\n` +
      `Campos ganados: ${camposGanados.join(', ') || 'Ninguno'}\n` +
      `Campos perdidos: ${camposPerdidos.join(', ') || 'Ninguno'}\n` +
      `Campos empatados: ${camposEmpatados.join(', ') || 'Ninguno'}`);

    if (this.categoriaSeleccionada === 'performance') {
      promptFinal += `
  
   IMPORTANTE:
  Aunque los puntos están basados en especificaciones técnicas (como potencia, torque, aceleración y peso), si el resultado es muy ajustado o hay empate técnico, debes considerar lo siguiente:
  
  - Transmisión: ¿Es manual, automática, doble embrague o CVT? Esto afecta la respuesta y el rendimiento real.
  - Tracción: ¿Es delantera, trasera o integral? Esto influye en el comportamiento dinámico y aceleración efectiva.
  
  Usa tu criterio experto para decidir cuál vehículo tiene una ventaja real en términos de performance aunque los datos sean similares.`;
    }

    return promptFinal;
  }
  getValor(valor: any): string {
    return valor !== undefined && valor !== null ? valor.toString() : 'No disponible';
  }

  animarTexto(texto: string) {
    this.textoAnimado = '';
    this.labelAnimado = '';
    let i = 0;
    const velocidad = 15;

    const escribir = () => {
      if (i < texto.length) {
        this.textoAnimado += texto.charAt(i);
        i++;
        setTimeout(escribir, velocidad);
      } else {
        this.animarLabel();
      }
    };

    escribir();
  }

  animarLabel() {
    let j = 0;
    const velocidadLabel = 25;

    const escribirLabel = () => {
      if (j < this.labelFinal.length) {
        this.labelAnimado += this.labelFinal.charAt(j);
        j++;
        setTimeout(escribirLabel, velocidadLabel);
      }
    };

    escribirLabel();
  }

}