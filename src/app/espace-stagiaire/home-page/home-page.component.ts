import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  template: `
 <main>
  <div class="home-page">
    <nav class="sidebar">
      <ul>
        <li><a routerLink="/espace-stagiaire/livrables">Livrables</a></li>
        <li><a routerLink="/espace-stagiaire/documents">Mes Documents</a></li>
        <li><a routerLink="/espace-stagiaire/profil">Mon Profil</a></li>
      </ul>
      <button class="logout-button" (click)="logout()">Déconnexion</button>
    </nav>

    <section class="main-content">
      <header class="navbar">
        <a href="#" class="home-link">
          <i class="fas fa-home"></i>
        </a>
      </header>
      <section class="content">
        <h3>Bienvenue {{ userName }}</h3>
        <!-- Ajoutez ici d'autres éléments de contenu -->
      </section>
    </section>
  </div>
</main>


  `,
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  userName: string = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.userName = localStorage.getItem('username') || 'Utilisateur'; // Retrieve username from localStorage
  }

  logout(): void {
    localStorage.removeItem('token'); // Supprimer le token de l'utilisateur
    localStorage.removeItem('username'); // Supprimer le nom d'utilisateur
    this.router.navigate(['/']); // Rediriger vers la page de connexion ou autre
  }

  goToDepots() {
    this.router.navigate(['/espace-stagiaire/depots']);
  }
}
