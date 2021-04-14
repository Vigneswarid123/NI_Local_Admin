import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncentiveMasterRoutingModule } from './incentive-master-routing.module';
import { IncentiveMasterComponent } from './incentive-master.component';
import { FeaturesModule } from '../Features.module';
import {PipesModule} from '../../Core/_pipes/pipes.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { SelectBoxComponent} from '../../Partials/incentive-master/select-box/select-box.component';
import { Routes, RouterModule } from '@angular/router';
import { DragNDropComponent } from '../../Partials/incentive-master/drag-n-drop/drag-n-drop.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalDialogModule } from '../../Shared/modal-dialog/modal-dialog.module';

@NgModule({
  declarations: [IncentiveMasterComponent,SelectBoxComponent, DragNDropComponent],
  imports: [
    CommonModule,
    IncentiveMasterRoutingModule,
    FormsModule, 
    ReactiveFormsModule,
    FeaturesModule,
    PipesModule,
    DragDropModule,
    AngularMultiSelectModule,
    ModalDialogModule,
  ],
})
export class IncentiveMasterModule { }
