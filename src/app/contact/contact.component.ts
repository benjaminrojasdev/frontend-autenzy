import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/components/header/header.component';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { RecaptchaModule } from 'ng-recaptcha';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { AuthServiceService } from '../auth-service.service';
import { FormService } from '../services/form.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

export function validarRut(control: AbstractControl): ValidationErrors | null {
  const rut = control.value;
  if (!rut || typeof rut !== 'string') return { invalidRut: true };

  const rutClean = rut.replace(/\./g, '').replace(/-/g, '').toUpperCase();
  if (!/^\d{7,8}[0-9K]$/.test(rutClean)) return { invalidRut: true };

  const body = rutClean.slice(0, -1);
  const dv = rutClean.slice(-1);

  let sum = 0;
  let multiplier = 2;

  for (let i = body.length - 1; i >= 0; i--) {
    sum += Number(body[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const expectedDV = 11 - (sum % 11);
  const dvCalc = expectedDV === 11 ? '0' : expectedDV === 10 ? 'K' : expectedDV.toString();

  return dvCalc !== dv ? { invalidRut: true } : null;
}

@Component({
  selector: 'app-contact',
  imports: [HeaderComponent, CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, RecaptchaModule, FooterComponent,ToastModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  contactForm: FormGroup;

  constructor
    (private fb: FormBuilder,
      private formService: FormService,
      private messageService: MessageService,
      private router: Router,
      private authService: AuthServiceService,
    ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      rut: ['', [Validators.required, validarRut]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required],
      captcha: ['', Validators.required]
    });
  }
onSubmit(): void {
  if (this.contactForm.invalid) {
    this.contactForm.markAllAsTouched();
    return;
  }

  const raw = this.contactForm.value;

  const payload = {
    name: raw.name,
    lastName: raw.lastName,
    rut: raw.rut,
    email: raw.email,
    phone: `+56 9${raw.phone}`,
    reason: raw.subject,
    message: raw.message,
    captcha: raw.captcha,
  };

  this.formService.sendEmail(payload).subscribe({
    next: () => {
      this.contactForm.reset();

      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Mensaje enviado con éxito',
        life: 3000
      });

      setTimeout(() => {
        this.router.navigate(['/']);
      }, 3000);
    },
    error: (err) => {
      console.error('Status:', err.status);
      console.error('Mensaje del servidor:', err.error?.message || err.message);
      console.error('Detalles:', err.error);

      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Ocurrió un problema al enviar el mensaje.',
        life: 4000
      });
    },
  });
}

  onCaptchaResolved(token: string | null): void {
    const control = this.contactForm.get('captcha');
    if (token && control) {
      control.setValue(token);
    } else {
      control?.reset();
    }
  }

  onRutInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^0-9kK]/g, '').toUpperCase();

    if (value.length > 9) {
      value = value.slice(0, 9);
    }

    if (value.length < 2) {
      this.contactForm.get('rut')?.setValue(value, { emitEvent: false });
      return;
    }

    const body = value.slice(0, -1);
    const dv = value.slice(-1);

    let formatted = '';
    let i = body.length;

    while (i > 3) {
      formatted = '.' + body.slice(i - 3, i) + formatted;
      i -= 3;
    }

    formatted = body.slice(0, i) + formatted;
    formatted = `${formatted}-${dv}`;

    this.contactForm.get('rut')?.setValue(formatted, { emitEvent: false });
  }

}





