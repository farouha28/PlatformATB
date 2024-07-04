import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EspaceEncadrantComponent } from './espace-encadrant.component'; // Assurez-vous que c'est le composant correct

@NgModule({
  declarations: [
    EspaceEncadrantComponent // Déclarez ici le composant EspaceEncadrantComponent, pas le module
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: 'espace-encadrant', component: EspaceEncadrantComponent }, // Utilisez le composant ici, pas le module
      // Ajoutez d'autres routes spécifiques à EspaceEncadrantComponent si nécessaire
    ])
  ],
  exports: [
    EspaceEncadrantComponent // Exportez le composant si nécessaire
  ]
})
export class EspaceEncadrantModule { }
