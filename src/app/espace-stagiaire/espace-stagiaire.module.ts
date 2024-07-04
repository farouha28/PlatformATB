import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule ici
import { EspaceStagiaireComponent } from './espace-stagiaire.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    EspaceStagiaireComponent
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
