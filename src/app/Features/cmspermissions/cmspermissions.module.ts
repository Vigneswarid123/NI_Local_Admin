import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cmsPermissionRoutingModule } from './cmspermissions.routing';
import { CmspermissionsComponent } from './cmspermissions.component';
import { FormsModule } from '@angular/forms';
//import { LoaderAnimationModule } from '../loader-animation/loader-animation.module';
//import { NgxSpinnerService } from "ngx-spinner"; 
import { FeaturesModule } from '../Features.module';


@NgModule({
  declarations: [CmspermissionsComponent],
  imports: [
    CommonModule,
    cmsPermissionRoutingModule,
    FormsModule,FeaturesModule
   // NgxSpinnerService
  ]
})
export class CmspermissionsModule { }
