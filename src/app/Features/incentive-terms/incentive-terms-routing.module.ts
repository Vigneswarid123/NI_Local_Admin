import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddSystemDefinedComponent } from './add-system-defined/add-system-defined.component';
import { EditSystemDefinedComponent } from './edit-system-defined/edit-system-defined.component';
import { GridSystemDefinedComponent } from './grid-system-defined/grid-system-defined.component';

const routes: Routes = [
  { path: 'incentiveTermsAdd', component: AddSystemDefinedComponent },
  { path: 'incentiveTermsEdit', component: EditSystemDefinedComponent },
  { path: 'incentiveTerms', component: GridSystemDefinedComponent },

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncentiveTermsRoutingModule { }
