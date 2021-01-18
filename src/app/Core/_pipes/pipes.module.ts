import { AlphaFilterPipe } from './alpha-filter/alpha-filter.pipe';
import { IfEmptyPipe } from './if-empty/if-empty.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';




@NgModule({
  declarations: [IfEmptyPipe,AlphaFilterPipe],
  imports: [
    CommonModule
  ],
  exports:[IfEmptyPipe,AlphaFilterPipe]
})
export class PipesModule { }


 