import { HomeResolve } from './home.resolve';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home.component';

const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'biblia',
	},
	{
		path: 'biblia',
		resolve: {
			menuBiblia: HomeResolve,
		},
		component: HomeComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class HomeRoutingModule {}
