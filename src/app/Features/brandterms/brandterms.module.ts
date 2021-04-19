import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrandtermsRoutingModule } from './brandterms-routing.module';
import { BrandtermsComponent } from './brandterms.component';


import { FeaturesModule } from '../Features.module';
import { PipesModule } from '../../Core/_pipes/pipes.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [BrandtermsComponent],
  imports: [
    CommonModule,
    BrandtermsRoutingModule,
    FeaturesModule,PipesModule,FormsModule, ReactiveFormsModule
  ]
})
export class BrandtermsModule { }
