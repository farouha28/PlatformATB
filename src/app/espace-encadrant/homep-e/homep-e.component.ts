import { Component } from '@angular/core';
interface Stagiaire {
  nom: string;
  sujet: string;
  periode: string;
  universite: string;
}
@Component({
  selector: 'app-homep-e',
  templateUrl: './homep-e.component.html',
  styleUrls: ['./homep-e.component.css']
})
export class HomepEComponent {
  stagiaires: Stagiaire[] = [
    { nom: 'Farah Ben Nasr', sujet: 'Detection des fraudes de signatures de cheque', periode: '01/08/2024 - 30/09/2024', universite: 'ESPRIT' },
    { nom: 'Khalil Haouari', sujet: 'Plateform de gestion des stages', periode: '15/07/2024 - 15/09/2024', universite: 'ESPRIT' },
    { nom: 'Dadju', sujet: 'Plateform de musiques', periode: '15/07/2024 - 15/09/2024', universite: 'PARIS' }
    // Ajoutez d'autres stagiaires selon vos besoins
  ];

  constructor() { }

  ngOnInit(): void {
    // Initialisation ou récupération de données supplémentaires
  }

  logout(): void {
    localStorage.removeItem('token'); // Supprimer le token de l'utilisateur
  }

  // Méthode pour télécharger un document
  telechargerDocument(type: string) {
    console.log('Téléchargement du document de type ' + type);
    // Implémentez la logique de téléchargement ici
  }

  // Méthode pour consulter un document
  consulterDocument(type: string) {
    console.log('Consultation du document de type ' + type);
    // Implémentez la logique de consultation ici
  }
}
