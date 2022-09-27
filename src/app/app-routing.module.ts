import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeModule } from './main/home/home.module';

const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'main',
	},
	{
		path: 'main',
		loadChildren: () => HomeModule,
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
