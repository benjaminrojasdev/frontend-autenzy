import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ModelsComponent } from './models/models.component';
import { AutenzyLoaderComponent } from './shared/components/autenzy-loader/autenzy-loader.component';
import { ComparatorComponent } from './comparator/comparator.component';
import { PoliticsComponent } from './politics/politics.component';
import { Home2Component } from './home2/home2.component';
import { ContactComponent } from './contact/contact.component';

export const routes: Routes = [
{ path: '', component: Home2Component },
{ path: 'modelos', component: ModelsComponent},
{ path: 'comparador', component: ComparatorComponent},
{ path: 'politicas', component: PoliticsComponent},
//{ path: 'test', component: Home2Component},
{ path: 'contacto', component: ContactComponent}
];