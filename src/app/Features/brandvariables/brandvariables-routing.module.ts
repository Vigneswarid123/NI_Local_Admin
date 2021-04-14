import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrandvariablesComponent } from './brandvariables.component';
const routes: Routes = [{path:'',component:BrandvariablesComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrandvariablesRoutingModule { }
