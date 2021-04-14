import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncentiveTermsRoutingModule } from './incentive-terms-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FeaturesModule } from '../Features.module';
import { PipesModule } from '../../Core/_pipes/pipes.module';
import { AddSystemDefinedComponent } from './add-system-defined/add-system-defined.component';
import { EditSystemDefinedComponent } from './edit-system-defined/edit-system-defined.component';
import { GridSystemDefinedComponent } from './grid-system-defined/grid-system-defined.component';


@NgModule({
  declarations: [
    AddSystemDefinedComponent,
    EditSystemDefinedComponent,
    GridSystemDefinedComponent
  ],
  imports: [
    CommonModule,
    IncentiveTermsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FeaturesModule,
    PipesModule
  ]
})
export class IncentiveTermsModule { }
