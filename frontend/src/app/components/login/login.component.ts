import { Component, EventEmitter, Output, Input, inject, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms"
import { Router, RouterModule } from "@angular/router"
import { AuthService } from '../../services/auth.service';
import { OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';


@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder)
  private api = inject(ApiService)
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router)
  @Output() loginSubmit = new EventEmitter<{ email: string, password: string }>();
  submitted = false;
  error = false;
  errorMsg = '';
  infoMsg = '';
  loadingLogin = false;
  loadingRegister = false;

  // Form Setup with email and password 
  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    name: ['',]
  })

  setEmail(email: string): void {
    this.form.controls.email.setValue(email);
    this.form.controls.email.markAsTouched();
    this.error = false; // limpa erro visual se existir
  }

  private saveUserName(name: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('user_name', (name || '').trim());
    }
  }

  isRegisterMode = false;

  toogleMode(): void {
    this.isRegisterMode = !this.isRegisterMode
  }

  // Touched Method to the Form
  submit(): void {
    this.submitted = true;
    this.error = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loadingLogin = true;
    this.loginSubmit.emit(this.form.getRawValue());
  }

  createAccount() {
    this.errorMsg = '';
    this.infoMsg = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loadingRegister = true;

    const { name, email, password } = this.form.getRawValue();

    this.api.register({ name, email, password }).subscribe({
      next: () => {
        this.loadingRegister = false;

        this.saveUserName(name);

        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('prefill_email', email);
          window.location.reload();
        }
      },
      error: (err) => {
        this.loadingRegister = false;
        this.errorMsg = err?.error?.message || 'Erro ao criar conta.';
      }
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedEmail = localStorage.getItem('prefill_email');

      if (savedEmail) {
        this.form.patchValue({ email: savedEmail });
        localStorage.removeItem('prefill_email');
      }
    }
  }

  // Function to Login with Google
  constructor(private auth: AuthService) { }

  async loginGoogle() {
    await this.auth.loginWithGoogle();
  }

  setInvalidCredentials(): void {
    this.error = true;
  }
}
