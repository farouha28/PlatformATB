import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule ici
import { EspaceStagiaireComponent } from './espace-stagiaire.component';
import { RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { DepotsComponent } from './depots/depots.component';
import { DocumentsComponent } from './documents/documents.component';

@NgModule({
  declarations: [
    EspaceStagiaireComponent,
    HomePageComponent,
    DepotsComponent,
    DocumentsComponent
  ],
  imports: [
    CommonModule,
    FormsModule, // Ajouter FormsModule ici
    RouterModule.forChild([{ path: '', component: EspaceStagiaireComponent }])
  ],
  exports: [
    EspaceStagiaireComponent
  ]
})
export class EspaceStagiaireModule { }
