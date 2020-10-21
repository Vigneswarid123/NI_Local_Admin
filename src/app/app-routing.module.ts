import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {AddGroupComponent} from './groups/add-group/add-group.component';
import {AddContactComponent} from './groups/contact/add-contact/add-contact.component';
import { HeaderComponent } from './header/header.component';
import { AuthGuard } from './_guards/auth.guard';
import { GroupDetailComponent } from './groups/group-detail/group-detail.component';
import { AddDealershipComponent } from './groups/dealership/add-dealership/add-dealership.component';
import { DealershipListComponent } from './groups/dealership/dealership-list/dealership-list.component';
import { DealershipDetailComponent } from './groups/dealership/dealership-detail/dealership-detail.component';
import { PopupComponent } from './groups/popup/popup.component';
import { BrandListComponent } from './brands/brand-list/brand-list.component';
import { TempDashboardComponent } from './temp-dashboard/temp-dashboard.component';
import { AddBrandComponent } from './brands/add-brand/add-brand.component';
import { ModelListComponent } from './model-list/model-list.component';
import { StylesListComponent } from './styles-list/styles-list.component';
import { GridRolesComponent } from './roles/grid-roles/grid-roles.component';
import { AddRolesComponent } from './roles/add-roles/add-roles.component';
import { EditRolesComponent } from './roles/edit-roles/edit-roles.component';
import { GridUserComponent } from './user/grid-user/grid-user.component';


const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    // path: 'dashboard',
    // component: DashboardComponent,
    // canActivate: [AuthGuard],

    path: 'dashboard',
    component: DashboardComponent,
    // canActivate: [AuthGuard],

  },
  {
    path: '',
    // canActivate: [AuthGuard],
    children: [
      { path: 'AddGroupComponent', component: AddGroupComponent },
      { path: 'AddContactComponent', component: AddContactComponent },
      { path: 'PopupComponent', component: PopupComponent },
      { path: 'Brands', component: BrandListComponent },
      { path: 'AddBrand', component: AddBrandComponent },
      { path: 'Models', component:ModelListComponent },
       { path:'Styles', component: StylesListComponent},
       { path: 'Roles', component: GridRolesComponent },
       { path: 'rolesAdd', component: AddRolesComponent },
       { path: 'rolesEdit', component: EditRolesComponent },
       { path: 'Users', component: GridUserComponent},
       {​​​​​​​​ path: 'AddDealership', component: AddDealershipComponent}​​​​​​​​,


    ],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
