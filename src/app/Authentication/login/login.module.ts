import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import {LoginComponent} from './login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import{ForgotpasswordComponent} from './forgotpassword/forgotpassword.component';

const routes: Routes = [{path:'',component:ForgotpasswordComponent}];


@NgModule({
  declarations: [LoginComponent,ForgotpasswordComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class LoginModule { }
