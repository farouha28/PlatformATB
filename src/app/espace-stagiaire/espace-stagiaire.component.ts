import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-espace-stagiaire',
  template: `
    <main>
      <section class="espace-stagiaire">
        <h2>Espace Stagiaire</h2>
        <p>Connectez-vous à votre compte</p>
        <div class="auth-container">
          <div class="auth-box">
            <h3>Authentification</h3>
            <form (ngSubmit)="login()">
              <label for="identifiant">Identifiant</label>
              <input type="text" id="identifiant" name="identifiant" [(ngModel)]="username" required>
              <label for="motdepasse">Mot de Passe</label>
              <input type="password" id="motdepasse" name="motdepasse" [(ngModel)]="password" required>
              <button type="submit">Se connecter</button>
              <a href="#" class="forgot-password">Mot de passe oublié ?</a>
            </form>
            <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>
          </div>
          <aside class="logo-container">
            <img class="animated-logo" src="/assets/logo.svg" alt="Logo animé ATB">
          </aside>
        </div>
        <a routerLink="/" class="home-link">
          <i class="fas fa-home"></i>
        </a>
      </section>
    </main>
  `,
  styleUrls: ['./espace-stagiaire.component.css']
})
export class EspaceStagiaireComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    console.log('Attempting login with:', { username: this.username, password: this.password });

    this.authService.login(this.username, this.password).subscribe(
      res => {
        console.log('Login success:', res);
        if (res && res.token) {
          localStorage.setItem('token', res.token);
          this.router.navigate(['/stagiaire-dashboard']);
        } else {
          this.errorMessage = 'Identifiant ou mot de passe incorrect';
        }
      },
      err => {
        console.error('Login error:', err);
        this.errorMessage = 'Identifiant ou mot de passe incorrect';
      }
    );
  }
}
