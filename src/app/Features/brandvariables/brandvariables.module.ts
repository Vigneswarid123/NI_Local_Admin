import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeaturesModule } from '../Features.module';
import { BrandvariablesRoutingModule } from './brandvariables-routing.module';
import { BrandvariablesComponent } from './brandvariables.component';
import { PipesModule } from '../../Core/_pipes/pipes.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [BrandvariablesComponent],
  imports: [
    CommonModule,
    BrandvariablesRoutingModule,
    FeaturesModule,PipesModule,FormsModule, ReactiveFormsModule
  ]
})
export class BrandvariablesModule { }
