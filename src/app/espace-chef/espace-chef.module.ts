import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EspaceChefComponent } from './espace-chef.component'; // Assurez-vous que c'est le composant correct

@NgModule({
  declarations: [
    EspaceChefComponent // Déclarez ici le composant EspaceChefComponent, pas le module
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: 'espace-chef', component: EspaceChefComponent },
      // Ajoutez d'autres routes spécifiques à EspaceChefComponent si nécessaire
    ])
  ],
  exports: [
    // Exportez des éléments si nécessaire
  ]
})
export class EspaceChefModule { }
