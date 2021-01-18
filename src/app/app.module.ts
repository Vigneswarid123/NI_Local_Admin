import { FeaturesModule } from './Features/Features.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AuthInterceptor} from './Core/_interceptor/auth.interceptor';
import {MatMenuModule} from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';


// imported modules from the src
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './Layout/header/header.component';
import { AddGroupComponent } from './Features/groups/add-group/add-group.component';
import { AddContactComponent } from './Features/groups/contact/add-contact/add-contact.component';
import { GroupDetailComponent } from './Features/groups/group-detail/group-detail.component';
import { AddDealershipComponent } from './Features/groups/dealership/add-dealership/add-dealership.component';
import { DealershipListComponent } from './Features/groups/dealership/dealership-list/dealership-list.component';
import { DealershipDetailComponent } from './Features/groups/dealership/dealership-detail/dealership-detail.component';
import { LoginComponent } from './Authentication/login/login.component';
import { DashboardComponent } from './Features/dashboard/dashboard.component';
import { PopupComponent } from './Features/groups/popup/popup.component';
import { AddBrandComponent } from './Features/brands/add-brand/add-brand.component';
import { BrandListComponent } from './Features/brands/brand-list/brand-list.component';
import { DeleteBrandComponent } from './Features/brands/delete-brand/delete-brand.component';
import { EditBrandComponent } from './Features/brands/edit-brand/edit-brand.component';
import { TempDashboardComponent } from './Features/temp-dashboard/temp-dashboard.component';
import { LeftPanelComponent } from './Layout/left-panel/left-panel.component';
import { ModelListComponent } from './Features/model-list/model-list.component';
import { StylesListComponent } from './Features/styles-list/styles-list.component';
import { AddRegionComponent } from './Features/regions/add-region/add-region.component';
import { EditRegionComponent} from './Features/regions/edit-region/edit-region.component';
import { GridRegionsComponent } from './Features/regions/grid-regions/grid-regions.component'; 

// import { GridRolesComponent } from './roles/grid-roles/grid-roles.component';
// import { AddRolesComponent } from './roles/add-roles/add-roles.component';
// import { EditRolesComponent } from './roles/edit-roles/edit-roles.component';

import { AddRolesComponent } from './Features/roles/add-roles/add-roles.component';
import { EditRolesComponent } from './Features/roles/edit-roles/edit-roles.component';
import { GridRolesComponent } from './Features/roles/grid-roles/grid-roles.component';

import { InventoryComponent } from './Features/inventory/inventory.component';
import { PipesModule } from './Core/_pipes/pipes.module';


import { AddUsersComponent } from './Features/user/add-users/add-users.component';
import { EditUsersComponent } from './Features/user/edit-users/edit-users.component';
import { GridUsersComponent } from './Features/user/grid-users/grid-users.component';
import {​​ Ng2SearchPipeModule }​​ from 'ng2-search-filter';

import { NgxSpinnerModule } from "ngx-spinner";
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import { from } from 'rxjs';
import { TextMaskModule } from 'angular2-text-mask';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminmodulesComponent } from './Features/adminmodules/adminmodules.component';
import{DealershipHeaderComponent} from './Features/groups/dealership-header/dealership-header.component';

import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatNativeDateModule} from '@angular/material/core';
import { ContactformComponent } from './Features/contactform/contactform.component';
import { SoftwareAgreementComponent } from './Features/software-agreement/software-agreement.component';

import { DealerusersComponent } from './Features/dealerusers/dealerusers.component';
import { EditDealerusersComponent } from './Features/edit-dealerusers/edit-dealerusers.component';

import { ImageCropperModule } from 'ngx-image-cropper';


import { AddSystemDefinedComponent } from './Features/incentive-terms/add-system-defined/add-system-defined.component';
import { EditSystemDefinedComponent } from './Features/incentive-terms/edit-system-defined/edit-system-defined.component';
import { GridSystemDefinedComponent } from './Features/incentive-terms/grid-system-defined/grid-system-defined.component';

import { OembrandsComponent } from './Features/oembrands/oembrands.component';

import { OemgroupsComponent } from './Features/oemgroups/oemgroups.component';
import { BrandpopupComponent } from './Features/brandpopup/brandpopup.component';
import { ContactComponent } from './Features/contact/contact.component';

import { DMSNamesComponent } from './Features/DMSNames/DMSNames.component';
import { OemgrouppopupComponent } from './Features/oemgrouppopup/oemgrouppopup.component';
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
import { NgxSliderModule  } from "@angular-slider/ngx-slider";
import { LineitemsComponent } from './Features/lineitems/lineitems.component';
import { VariablepopupComponent } from './Features/variablepopup/variablepopup.component';

// tslint:disable-next-line: typedef
export function tokenGetter() {
  return localStorage.getItem('aaat_token');
}


@NgModule({
  declarations: [		
    AppComponent,
    //HeaderComponent,
    //LeftPanelComponent,
    AddGroupComponent,
    AddContactComponent,
    GroupDetailComponent,
    AddDealershipComponent,
    DealershipListComponent,
    DealershipDetailComponent,
    LoginComponent,
    DashboardComponent,
    PopupComponent,
    AddBrandComponent,
    BrandListComponent,
    DeleteBrandComponent,
    EditBrandComponent,
    TempDashboardComponent,
    ModelListComponent,
    StylesListComponent,
    // GridRolesComponent,
    // AddRolesComponent,
    // EditRolesComponent,
    AddRolesComponent,
    EditRolesComponent,
    GridRolesComponent,
    OemgroupsComponent,
    AddRegionComponent,
    EditRegionComponent,
    GridRegionsComponent,
    //InventoryComponent,
    AddUsersComponent,
    EditUsersComponent,
    GridUsersComponent,
    AdminmodulesComponent,
    DealershipHeaderComponent,
    ContactformComponent,
    SoftwareAgreementComponent,
    OembrandsComponent,
    DealerusersComponent,
    EditDealerusersComponent,
    AddSystemDefinedComponent,
    EditSystemDefinedComponent,
    GridSystemDefinedComponent,
    BrandpopupComponent,
    ContactComponent,
    DMSNamesComponent,
    OemgrouppopupComponent,
    IncentivesComponent,
    GridIncentiveTypeComponent,
    AddIncentiveTypeComponent,
    EditIncentiveTypeComponent,
    SelectIncentiveTypeComponent,
    AddSubscriptionPlanComponent,
    EditSubscriptionPlanComponent,
    GridSubscriptionPlanComponent,
    DealerHoursComponent,
    LineitemsComponent,
    VariablepopupComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    TextMaskModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: ['http://niapi.local.com'],
        disallowedRoutes: ['http://niapi.local.com/api/auth/signin'],

        //  allowedDomains: ['http://localapi.throttle.com'],
        //  disallowedRoutes: ['http://localapi.throttle.com/api/auth/signin'],

      },
    }),
    BrowserAnimationsModule,
    MatMenuModule,
    MatDialogModule,
    ReactiveFormsModule ,
    NgxSpinnerModule,
    PipesModule,
    NgbModule,
    Ng2SearchPipeModule,
    FeaturesModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    ImageCropperModule,
    NgxSliderModule 
  ],
  providers: [
    {
      provide : HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      // provide: LocationStrategy, 
     //  useClass: HashLocationStrategy,
     
     multi   : true,
    },
  ],
  bootstrap: [AppComponent],
 
   
})
export class AppModule { }
 