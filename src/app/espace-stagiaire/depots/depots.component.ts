import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-depots',
  template:  `
<main>
  <div class="home-page">
    <nav class="navbar">
      <!-- Navbar avec liens vers Dépôts et Documents -->
      <ul>
        <li><a routerLink="/espace-stagiaire/depots">Dépôts</a></li>
        <li><a routerLink="/espace-stagiaire/documents">Documents</a></li>
      </ul>
      <!-- Bouton de déconnexion -->
      <button class="logout-button" (click)="logout()">Déconnexion</button>
    </nav>

    <!-- Section principale -->
    <section class="main-content">
      <section class="content">
        <!-- Contenu principal -->


        <!-- Formulaire de dépôt de rapport de stage -->
        <div class="centered-box">
          <form (submit)="submitRapport()">
            <label for="rapport">Déposer votre rapport de stage :</label>
            <input type="file" id="rapport" name="rapport" accept=".pdf,.doc,.docx">
            <button type="submit">Déposer</button>
          </form>
        </div>
        <!-- Lien pour consulter le rapport après dépôt -->
        <div *ngIf="rapportDepose">
          <h3>Rapport de stage déposé :</h3>
          <p><a href="{{ rapportUrl }}" target="_blank">Consulter le rapport</a></p>
        </div>
      </section>
    </section>
  </div>
</main>

  `,
  styleUrls: ['./depots.component.css']
})
export class DepotsComponent implements OnInit {
  userName: string = 'Farah Ben Nasr'; // Remplacez par le nom de l'utilisateur connecté
  rapportDepose: boolean = false;
  rapportUrl: string = ''; // URL du rapport déposé

  submitRapport() {
    // Logique pour soumettre le rapport (par exemple, envoyer au serveur)
    // Après le dépôt, définissez rapportDepose à true et définissez l'URL du rapport
    this.rapportDepose = true;
    this.rapportUrl = 'URL_DU_RAPPORT'; // Remplacez par l'URL réelle du rapport déposé
  }

  envoyerRemarques() {
    // Logique pour envoyer les remarques à l'encadreur
    alert('Remarques envoyées à l\'encadreur');
    // Vous pouvez implémenter l'envoi des remarques au serveur ici si nécessaire
  }
  ngOnInit(): void {
  }
  logout() {
    // Code pour la déconnexion (par exemple, suppression du token)
    localStorage.removeItem('token'); // Supprimer le token de l'utilisateur
    // Rediriger vers la page de connexion ou autre
    window.location.href = '/'; // Exemple de redirection vers la page d'accueil
  }
}
