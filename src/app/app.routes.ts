import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ModelsComponent } from './models/models.component';

export const routes: Routes = [
{ path: '', component: HomeComponent },
{ path: 'modelos', component: ModelsComponent}
];