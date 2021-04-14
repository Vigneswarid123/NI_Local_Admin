import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IncentiveMasterComponent } from './incentive-master.component';

const routes: Routes = [{ path: '', component: IncentiveMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncentiveMasterRoutingModule { }
