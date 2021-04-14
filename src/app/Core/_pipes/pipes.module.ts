import { AlphaFilterPipe } from './alpha-filter/alpha-filter.pipe';
import { IfEmptyPipe } from './if-empty/if-empty.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListfilterPipe} from '../../Core/_pipes/listfilter.pipe/listfilter.pipe';



@NgModule({
  declarations: [IfEmptyPipe,AlphaFilterPipe, ListfilterPipe],
  imports: [
    CommonModule
  ],
  exports:[IfEmptyPipe,AlphaFilterPipe, ListfilterPipe]
})
export class PipesModule { }


 