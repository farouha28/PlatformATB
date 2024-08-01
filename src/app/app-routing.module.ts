import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { EspaceStagiaireComponent } from './espace-stagiaire/espace-stagiaire.component';
import { EspaceEncadrantComponent } from './espace-encadrant/espace-encadrant.component';
import { EspaceChefComponent } from './espace-chef/espace-chef.component';
import { HomePageComponent } from './espace-stagiaire/home-page/home-page.component';
import { HomepEComponent } from './espace-encadrant/homep-e/homep-e.component';
import { ReclamationComponent } from './espace-encadrant/reclamation/reclamation.component';
import { DepotsComponent } from './espace-stagiaire/depots/depots.component';
import { DocumentsComponent } from './espace-stagiaire/documents/documents.component';
import { AuthGuard } from './auth.guard';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'espace-stagiaire',
    component: EspaceStagiaireComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'espace-encadrant',
    component: EspaceEncadrantComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'espace-chef',
    component: EspaceChefComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'espace-stagiaire/home-page',
    component: HomePageComponent
  },
  {
    path: 'espace-encadrant/homep-e',
    component: HomepEComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'espace-encadrant/reclamation',
    component: ReclamationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'espace-stagiaire/depots',
    component: DepotsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'espace-stagiaire/documents',
    component: DocumentsComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
