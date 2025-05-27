import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ModelsComponent } from './models/models.component';
import { AutenzyLoaderComponent } from './shared/components/autenzy-loader/autenzy-loader.component';
import { ComparatorComponent } from './comparator/comparator.component';
import { PoliticsComponent } from './politics/politics.component';

export const routes: Routes = [
{ path: '', component: HomeComponent },
{ path: 'modelos', component: ModelsComponent},
{ path: 'comparador', component: ComparatorComponent},
{ path: 'politicas', component: PoliticsComponent}
];