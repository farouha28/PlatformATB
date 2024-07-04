import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { EspaceStagiaireComponent } from './espace-stagiaire/espace-stagiaire.component';
import { EspaceEncadrantComponent } from './espace-encadrant/espace-encadrant.component';
import { EspaceChefComponent } from './espace-chef/espace-chef.component'; // Assurez-vous que c'est le chemin correct

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'espace-stagiaire', component: EspaceStagiaireComponent },
  { path: 'espace-encadrant', component: EspaceEncadrantComponent },
  { path: 'espace-chef', component: EspaceChefComponent }, // Ajoutez la route vers EspaceChefComponent
  { path: '**', redirectTo: '' } // Redirection par défaut vers la page d'accueil en cas de route non définie
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
