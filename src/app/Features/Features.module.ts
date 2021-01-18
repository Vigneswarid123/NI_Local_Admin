import { AtozFilterComponent } from '../Shared/atoz-filter/atoz-filter.component';
import { PipesModule } from './../Core/_pipes/pipes.module';
import { FeaturesRoutingModule } from '../Features/Features-routing.module';
import { LeftPanelComponent } from './../Layout/left-panel/left-panel.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './../Layout/header/header.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';




@NgModule({
  declarations: [ AtozFilterComponent,HeaderComponent,LeftPanelComponent,],
  imports: [
    CommonModule,
    NgxSpinnerModule,
    FeaturesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatDialogModule,
    PipesModule,
    
       
  ],
  exports:[HeaderComponent,LeftPanelComponent, AtozFilterComponent],
  
})
export class FeaturesModule { }
