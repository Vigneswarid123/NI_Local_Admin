import { PipesModule } from './../../Core/_pipes/pipes.module';
import { InventoryService } from './../../Core/_providers/inventory-service/inventory.service';
import { FeaturesModule } from './../Features.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryRoutingModule } from './inventory-routing.module';
import { InventoryComponent } from './inventory.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';




@NgModule({
  declarations: [InventoryComponent],
  imports: [
    CommonModule,
    InventoryRoutingModule,
    FeaturesModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule
  ],
  providers:[InventoryService]
})
export class InventoryModule { }
