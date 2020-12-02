import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { ListingComponent } from "./listing/listing.component";
import { HelpComponent } from "./help/help.component";
import { AuthGuard } from "../core/authentication/auth.guard";
import { SettingsComponent } from "./settings/settings.component";

// const routes: Routes = [
//   { path: '', canActivate: [AuthGuard], pathMatch: 'full', redirectTo: '/system/listing' },
//   {
//     path: 'listing', canActivate: [AuthGuard], children: [
//       { path: '', component: HomeComponent, children: [{ path: '', component: ListingComponent }] },
//       { path: 'role-listing', component: HomeComponent, loadChildren: () => import('./roles/roles.module').then(m => m.RolesModule) },
//     ]
//   },
//   { path: 'help', canActivate: [AuthGuard], component: HomeComponent, children: [{ path: '', component: HelpComponent }] }

// ];

// const routes: Routes = [
//   {
//     path: '', canActivate: [AuthGuard],
//     children: [
//       { path: '', redirectTo: '/system/listing', pathMatch: 'full' },
//       {
//         path: 'listing',
//         children: [
//           {
//             path: '', component: HomeComponent,
//             children: [
//               { path: '', component: ListingComponent }
//             ]
//           },
//           { path: 'role-listing', component: HomeComponent, loadChildren: () => import('./roles/roles.module').then(m => m.RolesModule) },
//         ]
//       },
//       { path: 'help', component: HomeComponent, children: [{ path: '', component: HelpComponent }] }
//     ]
//   }
// ];

const routes: Routes = [
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      { path: "", redirectTo: "/system/dashboard", pathMatch: "full" },
      //{ path: "", redirectTo: "/system/listing", pathMatch: "full" },

      {
        path: "listing",
        children: [
          {
            path: "",
            redirectTo: "shows",
            pathMatch: "full"
            /*children: [
              {
                path: "",
                component: ListingComponent
              }
            ]*/
          },

          {
            path: "shows",
            loadChildren: () =>
              import("./shows/shows.module").then(m => m.ShowsModule)
          },
          {
            path: "configs",
            loadChildren: () =>
              import("./configs/configs.module").then(m => m.ConfigsModule)
          },
          {
            path: "tasks",
            loadChildren: () =>
              import("./tasks/tasks.module").then(m => m.TasksModule)
          },
          {
            path: "time-sheet",
            loadChildren: () =>
              import("./time-sheet/time-sheet.module").then(
                m => m.TimeSheetModule
              )
          },
          {
            path: "time-sheet-review",
            loadChildren: () =>
              import("./time-sheet-review/time-sheet-review.module").then(
                m => m.TimeSheetReviewModule
              )
          },
          {
            path: "playlists",
            loadChildren: () =>
              import("./playlist/playlist.module").then(m => m.PlaylistModule)
          },
          {
            path: "report",
            loadChildren: () =>
              import("./report/report.module").then(m => m.ReportModule)
          },
          {
            path: "daybook",
            loadChildren: () =>
              import("./daybook/daybook.module").then(m => m.DaybookModule)
          },
          {
            path: "favourites",
            loadChildren: () =>
              import("./favourites/favourites.module").then(
                m => m.FavouritesModule
              )
          },
          {
            path: "gantt",
            loadChildren: () =>
              import("./gantt/gantt.module").then(m => m.GanttModule)
          }

          /*{
            path: "roles",
            loadChildren: () =>
              import("./roles/roles.module").then(m => m.RolesModule)
          },
          {
            path: "templates",
            loadChildren: () =>
              import("./templates/templates.module").then(m => m.TemplatesModule)
          },
          {
            path: "groups",
            loadChildren: () =>
              import("./groups/groups.module").then(m => m.GroupsModule)
          },
          {
            path: "departments",
            loadChildren: () =>
              import("./departments/departments.module").then(m => m.DepartmentsModule)
          },*/
        ]
      },
      { path: "help", children: [{ path: "", component: HelpComponent }] },
      /*{
        path: "settings",
        children: [{
          path: "", loadChildren: () =>
            import("./configs/configs.module").then(m => m.ConfigsModule)
        }]
      },*/
      {
        path: "dashboard",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("./dashboards/dashboards.module").then(
                m => m.DashboardsModule
              )
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule {}
