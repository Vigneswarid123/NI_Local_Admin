import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncentiveVariablesRoutingModule } from './incentive-variables-routing.module';
import { IncentiveVariablesComponent } from './incentive-variables.component';
import { FeaturesModule } from '../Features.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import{PipesModule} from '../../Core/_pipes/pipes.module'

@NgModule({ 
  declarations: [IncentiveVariablesComponent],
  imports: [
    FormsModule, ReactiveFormsModule,
    CommonModule,
    IncentiveVariablesRoutingModule,FeaturesModule,PipesModule
  ]
})
export class IncentiveVariablesModule { }
