import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CmspermissionsComponent } from './cmspermissions.component';


const routes: Routes = [
  { path: '', component: CmspermissionsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class cmsPermissionRoutingModule { }
