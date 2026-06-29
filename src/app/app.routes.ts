import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'inicio'
	},
	{
		path: 'inicio',
		loadComponent: () => import('./pages/inicio.page').then((m) => m.InicioPage)
	},
	{
		path: 'analisis-flujo',
		loadComponent: () => import('./features/vote-flow-analysis/vote-flow-analysis.page').then((m) => m.VoteFlowAnalysisPage)
	},
	{
		path: 'acerca',
		loadComponent: () => import('./pages/acerca.page').then((m) => m.AcercaPage)
	},
	{
		path: '**',
		redirectTo: 'inicio'
	}
];
