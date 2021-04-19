import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BrandtermsComponent } from './brandterms.component';

const routes: Routes = [{ path: '', component: BrandtermsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrandtermsRoutingModule { }
