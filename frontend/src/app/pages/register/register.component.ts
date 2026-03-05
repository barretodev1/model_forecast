import { Component, ViewChild, inject, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../auth/auth.service';
import { LoginComponent } from '../../components/login/login.component';

type LoginResponse = {
  token?: string;
  accessToken?: string;
  access_token?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
};

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, RouterModule, LoginComponent],
  templateUrl: './register.component.html'
})

export class RegisterComponent implements OnInit, AfterViewInit {
private api = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);

  @ViewChild(LoginComponent) card!: LoginComponent;

  loading = false;

  private cameFromBackButton = false;

  constructor() {
    const nav = this.router.getCurrentNavigation();
    this.cameFromBackButton = nav?.trigger === 'popstate';
  }

  ngOnInit(): void {

    if (this.auth.isLoggedIn() && !this.cameFromBackButton) {
      const returnUrl =
        this.route.snapshot.queryParamMap.get('returnUrl') || '/home';

      this.router.navigateByUrl(returnUrl);
    }
  }

  ngAfterViewInit(): void {
    const email = this.route.snapshot.queryParamMap.get('email');
    if (email && this.card) {
      this.card.setEmail(email);
    }
  }

  onLogin(payload: { email: string; password: string }): void {
    const { email, password } = payload;
  
    if (this.loading) return;

    this.loading = true;

    this.api
      .login({ email, password })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res: LoginResponse) => {
          const token = res?.token ?? res?.accessToken ?? res?.access_token;

          if (token) this.auth.setToken(token);

          const userName = res?.user?.name;
          if (userName) this.auth.setUserName(userName);

          const returnUrl =
            this.route.snapshot.queryParamMap.get('returnUrl') || '/home';

          this.router.navigateByUrl(returnUrl);
        },
        error: () => {
          this.card?.setInvalidCredentials();
        },
      });
  }
}
