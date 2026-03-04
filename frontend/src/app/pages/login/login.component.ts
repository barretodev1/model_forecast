import { Component, EventEmitter, Output, Input, inject, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms"
import { Router, RouterModule } from "@angular/router"
import { AuthService } from '../../../services/auth.service';
import { ApiService } from '../../../services/api.service';


@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
private fb = inject(FormBuilder) 
private api = inject(ApiService) 
private platformId = inject(PLATFORM_ID); 
private router = inject(Router) 
@Input() loading = false; 
@Output() loginSubmit = new EventEmitter<{ email: string, password: string, name: string }>(); 
submitted = false; 
error = false; 
errorMsg = ''; 
infoMsg = '';

  // Form Setup with email and password 
  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    name: ['',]
  })

  private saveUserName(name: string) {
     if (isPlatformBrowser(this.platformId)) {
       localStorage.setItem('user_name', (name || '').trim()); 
  }}

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

    this.loginSubmit.emit(this.form.getRawValue());
  }

  createAccount() {
    this.errorMsg = '';
    this.infoMsg = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const { name, email, password } = this.form.getRawValue();

    this.api.register({ name, email, password }).subscribe({
      next: () => {
        this.loading = false;

        this.saveUserName(name);

        this.router.navigate(['/'], { queryParams: { email } });
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Erro ao criar conta.';
      }
    });
  }

  // Function to Login with Google
  constructor(private auth: AuthService) { }

  async loginGoogle() {
    await this.auth.loginWithGoogle();
  }

}
