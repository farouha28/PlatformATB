import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeModule } from './home/home.module';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { HttpClientModule } from '@angular/common/http';
import { EspaceStagiaireModule } from './espace-stagiaire/espace-stagiaire.module';
import { EspaceEncadrantModule } from './espace-encadrant/espace-encadrant.module';
import { EspaceChefModule } from './espace-chef/espace-chef.module'; // Assurez-vous que c'est le chemin correct vers le composant

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HomeModule,
    FormsModule,
    HttpClientModule, 
    EspaceStagiaireModule,
    EspaceEncadrantModule,
    EspaceChefModule

    // Ne pas importer EspaceChefComponent ici s'il s'agit d'un composant et non d'un module
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
