import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './Authentication/login/login.component';
import { DashboardComponent } from './Features/dashboard/dashboard.component';
import {AddGroupComponent} from './Features/groups/add-group/add-group.component';
import {AddContactComponent} from './Features/groups/contact/add-contact/add-contact.component';

import { AuthGuard } from './Core/_guards/auth.guard';
import { GroupDetailComponent } from './Features/groups/group-detail/group-detail.component';
import { AddDealershipComponent } from './Features/groups/dealership/add-dealership/add-dealership.component';
import { DealershipListComponent } from './Features/groups/dealership/dealership-list/dealership-list.component';
import { DealershipDetailComponent } from './Features/groups/dealership/dealership-detail/dealership-detail.component';
import { PopupComponent } from './Features/groups/popup/popup.component';
import { BrandListComponent } from './Features/brands/brand-list/brand-list.component';
import { TempDashboardComponent } from './Features/temp-dashboard/temp-dashboard.component';
import { AddBrandComponent } from './Features/brands/add-brand/add-brand.component';
import { ModelListComponent } from './Features/model-list/model-list.component';
import { StylesListComponent } from './Features/styles-list/styles-list.component';
import { GridRolesComponent } from './Features/roles/grid-roles/grid-roles.component';
import { AddRolesComponent } from './Features/roles/add-roles/add-roles.component';
import { EditRolesComponent } from './Features/roles/edit-roles/edit-roles.component';
 
import { OemgroupsComponent } from './Features/oemgroups/oemgroups.component';
import { AddRegionComponent } from './Features/regions/add-region/add-region.component';
import { EditRegionComponent} from './Features/regions/edit-region/edit-region.component';
import { GridRegionsComponent } from './Features/regions/grid-regions/grid-regions.component';

import { InventoryComponent } from './Features/inventory/inventory.component';
import { AddUsersComponent } from './Features/user/add-users/add-users.component';
import { EditUsersComponent } from './Features/user/edit-users/edit-users.component';
import { GridUsersComponent } from './Features/user/grid-users/grid-users.component';

import { ContactformComponent } from './Features/contactform/contactform.component';
import { SoftwareAgreementComponent } from './Features/software-agreement/software-agreement.component';

import { OembrandsComponent } from './Features/oembrands/oembrands.component';
import { DealerusersComponent } from './Features/dealerusers/dealerusers.component'; 
import { EditDealerusersComponent } from './Features/edit-dealerusers/edit-dealerusers.component';

import { AddSystemDefinedComponent } from './Features/incentive-terms/add-system-defined/add-system-defined.component';
import { EditSystemDefinedComponent } from './Features/incentive-terms/edit-system-defined/edit-system-defined.component';
import { GridSystemDefinedComponent } from './Features/incentive-terms/grid-system-defined/grid-system-defined.component';

import { AdminmodulesComponent } from './Features/adminmodules/adminmodules.component';
import {DMSNamesComponent} from './Features/DMSNames/DMSNames.component';
import {IncentivesComponent} from './Features/incentives/incentives.component';

import { GridIncentiveTypeComponent } from './Features/incentive-types/grid-incentiveType/grid-incentiveType.component'
import { AddIncentiveTypeComponent } from './Features/incentive-types/add-incentiveType/add-incentiveType.component'
import { EditIncentiveTypeComponent } from './Features/incentive-types/edit-incentiveType/edit-incentiveType.component'
import { SelectIncentiveTypeComponent  } from './Features/incentive-types/select-incentiveType/select-incentiveType.component';
// subscription plans
import { AddSubscriptionPlanComponent } from './Features/subscriptionPlans/add-subscriptionPlan/add-subscriptionPlan.component';
import { EditSubscriptionPlanComponent } from './Features/subscriptionPlans/edit-subscriptionPlan/edit-subscriptionPlan.component';
import { GridSubscriptionPlanComponent } from './Features/subscriptionPlans/grid-subscriptionPlan/grid-subscriptionPlan.component';
import { DealerHoursComponent } from './Features/dealer-hours/dealer-hours.component';
 
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
    canActivate: [AuthGuard],

  },
  { path: 'inventory', loadChildren: () => import('./Features/inventory/inventory.module').then(m => m.InventoryModule), canActivate: [AuthGuard] },
  {
    path: '',
    canActivate: [AuthGuard],
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
       //     {​​​​​​​​ path: 'AddDealership', component: AddDealershipComponent}​​​​​​​​,
       { path: 'DealershipDetails', component: DealershipDetailComponent},
       { path: 'AddDealership/:id', component: AddDealershipComponent },
       { path: 'AddDealership/:id', component: AddDealershipComponent},
       {path: 'EditDealership/:dealerid/:id', component: AddDealershipComponent },
       {​​​​​​​​ path: 'DealershipList', component: DealershipListComponent}​​​​​​​​,
       {​​​​​​​​ path: 'DealershipList/:dealerid', component: DealershipListComponent}​​​​​​​​,
       { path: 'AddGroupComponent/:id', component: AddGroupComponent },
       { path: 'AddDealership/:dealerid/:groupid', component: AddDealershipComponent },
       { path: 'DealershipDetails/:dealergrpid/:index', component: DealershipDetailComponent},
       { path: 'OEMGroups', component: OemgroupsComponent},
       { path: 'regionAdd', component: AddRegionComponent},
       { path: 'regions', component: GridRegionsComponent},
       {path: 'editregions', component:EditRegionComponent},
       //{ path: 'inventory', component: InventoryComponent },
       { path: 'addusers', component: AddUsersComponent},
       { path: 'editusers', component: EditUsersComponent},
       { path: 'users', component: GridUsersComponent},
       { path: 'adminmodules', component: AdminmodulesComponent },
       { path : 'ContractForm' ,component:ContactformComponent },
       { path : 'SoftwareAgreement', component : SoftwareAgreementComponent },
       { path: 'oembrands', component: OembrandsComponent},
       { path: 'dealerusers', component: DealerusersComponent},
       { path: 'dealerusersedit', component: EditDealerusersComponent}, 
       { path: 'incentiveTerms', component: GridSystemDefinedComponent},
       { path: 'incentiveTermsAdd', component: AddSystemDefinedComponent},
       { path: 'incentiveTermsEdit', component: EditSystemDefinedComponent},
       { path: 'DMSNames', component: DMSNamesComponent},
       { path : 'Incentives', component : IncentivesComponent},
       { path: 'incentiveTypes', component: GridIncentiveTypeComponent},
       { path: 'incentiveTypesAdd', component: AddIncentiveTypeComponent},
       { path: 'incentiveTypesEdit', component: EditIncentiveTypeComponent},
       { path: 'incentiveTypeSelect', component: SelectIncentiveTypeComponent}, 
       { path: 'subscriptionPlans', component: GridSubscriptionPlanComponent},
       { path: 'subscriptionPlansAdd', component: AddSubscriptionPlanComponent},
       { path: 'subscriptionPlansEdit', component: EditSubscriptionPlanComponent},
       { path: 'dealerhours', component: DealerHoursComponent }
    ],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{​​​​​​​​ useHash:false }​​​​​​​​)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
