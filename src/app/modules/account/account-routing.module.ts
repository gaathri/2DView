import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SignupComponent } from "./signup/signup.component";
import { LoginComponent } from "./login/login.component";
import { AuthGuard } from "../core/authentication/auth.guard";
import { AccountHomeComponent } from "./account-home/account-home.component";

const routes: Routes = [
  // { path: '', pathMatch: 'full', redirectTo: '/login' },
  // { path: 'login', component: AccountHomeComponent, children: [{ path: '', component: LoginComponent }] },
  // { path: 'signup', component: AccountHomeComponent, children: [{ path: '', component: SignupComponent }] },
  {
    path: "",
    children: [
      { path: "", redirectTo: "/login", pathMatch: "full" },
      {
        path: "login",
        component: AccountHomeComponent,
        children: [
          {
            path: "",
            component: LoginComponent,
            canActivate: [AuthGuard],
          },
        ],
      },
    ],
  },
];

/*const routes2: Routes = [
  {
    path: '', canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: '/system/listing', pathMatch: 'full' },
      {
        path: 'listing',
        children: [
          {
            path: '',
            children: [
              { path: '', component: ListingComponent }
            ]
          },
          { path: 'role-listing', loadChildren: () => import('./roles/roles.module').then(m => m.RolesModule) },
        ]
      },
      { path: 'help', children: [{ path: '', component: HelpComponent }] },
      { path: 'settings', children: [{ path: '', component: SettingsComponent }] },
    ]
  }
];*/

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
