import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <main>
      <nav class="navbar" *ngIf="showNavbar">
        <a routerLink="/" class="brand-logo-link">
          <img class="brand-logo" src="/assets/logo.svg" alt="logo" aria-hidden="true">
        </a>
        <ul>
          <li><a routerLink="/espace-stagiaire">Espace Stagiaire</a></li>
          <li><a href="/espace-encadrant">Espace Encadrant(e)</a></li>
          <li><a href="/espace-chef">Espace Chef(fe) Departement</a></li>
        </ul>
      </nav>
      <section class="content animated-content">
        <router-outlet></router-outlet> <!-- Affiche le contenu principal chargé par Angular -->
      </section>
      <footer class="footer" *ngIf="showFooter">
        <p>Contact: <a href="mailto:contact@atb.com">contact@atb.com.tn</a></p>
        <p>Tél : 71 351 155 N° vert : 80 10 03 47</p>
        <p>Siège Social : 9 Rue Hédi Nouira - 1001 Tunis Siège Lac 2 : Rue de la feuille d'érable lac 2 - Immeuble les Pins Bloc A - 1053 Tunis</p>
      </footer>
    </main>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showNavbar = true;
  showFooter = true;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateVisibility(event.url);
      }
    });
  }

  private updateVisibility(url: string) {
    this.showNavbar = url === '/';
    this.showFooter = url === '/';
  }
}
