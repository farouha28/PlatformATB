import { Component } from '@angular/core';

interface Mail {
  sender: string;
  subject: string;
  content: string;
  date: Date;
}

@Component({
  selector: 'app-reclamation',
  templateUrl: './reclamation.component.html',
  styleUrls: ['./reclamation.component.css']
})
export class ReclamationComponent {

  mails: Mail[] = [
    {
      sender: 'farah.bennasr@esprit.tn',
      subject: 'Problème avec le sujet du stage',
      content: 'Problème dans mySQL...',
      date: new Date('2024-07-12T10:30:00')
    },
    {
      sender: 'khalil.haouari@esprit.tn',
      subject: 'Demande d\'information sur la période du stage',
      content: '...',
      date: new Date('2024-07-11T15:45:00')
    },
    // Ajoutez d'autres mails simulés selon vos besoins
  ];

}
