import { Component } from '@angular/core';

@Component({
  selector: 'app-espace-encadrant',
  template:  `
  <main>
    <section class="espace-stagiaire">
      <h2>Espace Encadrant(e)</h2>
      <p>Connectez-vous à votre compte</p>
      <div class="auth-container">
        <div class="auth-box">
          <h3>Authentification</h3>
          <form>
            <label for="identifiant">Identifiant</label>
            <input type="text" id="identifiant" name="identifiant">
            <label for="motdepasse">Mot de Passe</label>
            <input type="password" id="motdepasse" name="motdepasse">
            <button type="submit">Se connecter</button>
            <a href="#" class="forgot-password">Mot de passe oublié ?</a>
          </form>
        </div>
        <aside class="logo-container">
          <img class="animated-logo" src="/assets/logo.svg" alt="Logo animé ATB">
        </aside>
      </div>
       <!-- Icône de retour à la page d'accueil -->
        <a routerLink="/" class="home-link">
          <i class="fas fa-home"></i>
        </a>
    </section>
  </main>
`,
  styleUrls: ['./espace-encadrant.component.css']
})
export class EspaceEncadrantComponent {

}
