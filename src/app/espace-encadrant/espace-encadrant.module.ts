import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EspaceEncadrantComponent } from './espace-encadrant.component';
import { HomepEComponent } from './homep-e/homep-e.component';
import { ReclamationComponent } from './reclamation/reclamation.component';

@NgModule({
  declarations: [
    EspaceEncadrantComponent,
    HomepEComponent,
    ReclamationComponent// Déclarez ici le composant EspaceEncadrantComponent, pas le module
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: EspaceEncadrantComponent }, // Utilisez le composant ici, pas le module
     // { path: 'home-page-encadrant', component: HomePageEncadrantComponent }
      // Ajoutez d'autres routes spécifiques à EspaceEncadrantComponent si nécessaire
    ])
  ],
  exports: [
    EspaceEncadrantComponent // Exportez le composant si nécessaire
  ]
})
export class EspaceEncadrantModule { }
