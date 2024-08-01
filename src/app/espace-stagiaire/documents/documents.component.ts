import { Component, OnInit  } from '@angular/core';

@Component({
  selector: 'app-documents',
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
      <!-- Liens vers les fichiers -->
    <section class="files-section">
      <h3>Fichiers à télécharger :</h3>
      <ul>
        <li><a href="assets/lettre_affectation.pdf" target="_blank">Lettre d'affectation (PDF)</a></li>
        <li><a href="assets/demande_stage.docx" target="_blank">Demande de stage (DOCX)</a></li>
      </ul>
    </section>
    </div>
  </main>
  
    `,
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit  {
  ngOnInit(): void {
  }
  logout() {
    // Code pour la déconnexion (par exemple, suppression du token)
    localStorage.removeItem('token'); // Supprimer le token de l'utilisateur
    // Rediriger vers la page de connexion ou autre
    window.location.href = '/'; // Exemple de redirection vers la page d'accueil
  }
}
