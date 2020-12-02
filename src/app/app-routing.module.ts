import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './modules/core/authentication/auth.guard';
import { HomeComponent } from './modules/system/home/home.component';
import { AccountHomeComponent } from './modules/account/account-home/account-home.component';
import { PageNotFoundComponent } from './modules/shared/components/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', loadChildren: () => import('./modules/account/account.module').then(m => m.AccountModule) },
  { path: 'system', component: HomeComponent, loadChildren: () => import('./modules/system/system.module').then(m => m.SystemModule) },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
