import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
    { path: '', component: RegisterComponent },
    {
        path: 'home',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./pages/home/home.component').then(m => m.HomeComponent),
    },
];
