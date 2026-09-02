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
		path: 'matriz-escenarios',
		loadComponent: () => import('./features/scenario-views/scenario-matrix/scenario-matrix.page').then((m) => m.ScenarioMatrixPage)
	},
	{
		path: 'estadisticas-escenarios',
		loadComponent: () => import('./features/scenario-views/scenario-stats/scenario-stats.page').then((m) => m.ScenarioStatsPage)
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
