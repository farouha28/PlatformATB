import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.http.post('/api/login', { username: this.username, password: this.password })
      .subscribe(
        (response: any) => {
          // Handle successful login
          this.router.navigate(['/espace-stagiaire/home-page']);
        },
        (error: any) => {
          // Handle error
          this.errorMessage = 'Invalid username or password';
        }
      );
  }
}