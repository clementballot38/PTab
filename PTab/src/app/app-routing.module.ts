import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';



const routes: Routes = [
	{ path: '', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
	{ path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule) },

	{ path: '**', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) }
];



@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})



export class AppRoutingModule { }