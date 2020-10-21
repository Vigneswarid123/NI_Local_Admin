import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AuthInterceptor} from './_interceptor/auth.interceptor';
import {MatMenuModule} from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';


// imported modules from the src
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AddGroupComponent } from './groups/add-group/add-group.component';
import { AddUserComponent } from './groups/user/add-user/add-user.component';
import { AddContactComponent } from './groups/contact/add-contact/add-contact.component';
import { GroupDetailComponent } from './groups/group-detail/group-detail.component';
import { AddDealershipComponent } from './groups/dealership/add-dealership/add-dealership.component';
import { DealershipListComponent } from './groups/dealership/dealership-list/dealership-list.component';
import { DealershipDetailComponent } from './groups/dealership/dealership-detail/dealership-detail.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PopupComponent } from './groups/popup/popup.component';
import { AddBrandComponent } from './brands/add-brand/add-brand.component';
import { BrandListComponent } from './brands/brand-list/brand-list.component';
import { DeleteBrandComponent } from './brands/delete-brand/delete-brand.component';
import { EditBrandComponent } from './brands/edit-brand/edit-brand.component';
import { TempDashboardComponent } from './temp-dashboard/temp-dashboard.component';
import { LeftPanelComponent } from './left-panel/left-panel.component';
import { DealershipHeaderComponent} from './groups/dealership-header/dealership-header.component';
import { ModelListComponent } from './model-list/model-list.component';
import { StylesListComponent } from './styles-list/styles-list.component';
import { GridRolesComponent } from './roles/grid-roles/grid-roles.component';
import { AddRolesComponent } from './roles/add-roles/add-roles.component';
import { EditRolesComponent } from './roles/edit-roles/edit-roles.component';
import { GridUserComponent } from './user/grid-user/grid-user.component';
 

// tslint:disable-next-line: typedef
export function tokenGetter() {
  return localStorage.getItem('aaat_token');
}


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AddGroupComponent,
    AddUserComponent,
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
    LeftPanelComponent,
    DealershipHeaderComponent,
    ModelListComponent,
    StylesListComponent,
    GridRolesComponent,
    AddRolesComponent,
    EditRolesComponent,
    GridUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: ['http://throttleapi.azaz.com'],
        disallowedRoutes: ['http://throttleapi.azaz.com/api/auth/signin'],

        //  allowedDomains: ['http://localapi.throttle.com'],
        //  disallowedRoutes: ['http://localapi.throttle.com/api/auth/signin'],

      },
    }),
    BrowserAnimationsModule,
    MatMenuModule,
    MatDialogModule,
    ReactiveFormsModule 
  ],
  providers: [
    {
      provide : HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi   : true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
