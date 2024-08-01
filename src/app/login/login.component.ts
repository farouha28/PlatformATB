import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  template: `
   <main>
  <section class="auth-section">
    <h2>Login</h2>
    <p>Connectez-vous à votre compte</p>

    <div class="auth-container">
      <div class="auth-box">
        <h3>Authentification</h3>
        <form (ngSubmit)="login()">
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" [(ngModel)]="email" name="email" required>
          </div>
          <div class="form-group">
            <label for="password">Password:</label>
            <input type="password" id="password" [(ngModel)]="password" name="password" required>
          </div>
          <button type="submit">Login</button>
          <div class="auth-links">
            <a href="/forgot-password" class="forgot-password">Forgot password?</a>
            <a href="/register" class="create-account">Create an account</a>
          </div>
        </form>
        <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>

        <!-- Messages conditionnels basés sur le rôle -->
        <div *ngIf="userRole === 'stagiaire'" class="role-message">
          Welcome, stagiaire!
        </div>
        <div *ngIf="userRole === 'chef'" class="role-message">
          Welcome, chef!
        </div>
        <div *ngIf="userRole === 'encadrant'" class="role-message">
          Welcome, encadrant!
        </div>
      </div>
      <aside class="logo-container">
        <img class="animated-logo" src="/assets/logo.svg" alt="Logo animated">
      </aside>
    </div>
    <a routerLink="/" class="home-link">
      <i class="fas fa-home"></i>
    </a>
  </section>
</main>



  `,
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  userRole: string = ''; // Variable pour stocker le rôle de l'utilisateur

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.authService.login(this.email, this.password).subscribe(
      (response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', response.username); // Store username
        localStorage.setItem('role', response.role); // Store role

        // Redirect based on role
        if (response.role === 'stagiaire') {
          this.router.navigate(['/espace-stagiaire/home-page']);
        } else if (response.role === 'chef') {
          this.router.navigate(['/espace-chef/home-page']);
        } else if (response.role === 'encadrant') {
          this.router.navigate(['/espace-encadrant/homep-e']);
        } else {
          this.errorMessage = 'Role not recognized';
        }
      },
      (error: any) => {
        this.errorMessage = 'Email ou mot de passe incorrect';
      }
    );
  }
}
