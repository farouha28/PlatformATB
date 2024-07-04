import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: HomeComponent },
      // Ajoutez d'autres routes spécifiques à HomeComponent si nécessaire
    ])
  ],
  exports: [
    HomeComponent
  ]
})
export class HomeModule { }
