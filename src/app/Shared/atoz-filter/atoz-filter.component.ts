import { Component, OnInit,Input, Output, EventEmitter  } from '@angular/core';

@Component({
  selector: 'app-atoz-filter',
  templateUrl: './atoz-filter.component.html',
  styleUrls: ['./atoz-filter.component.scss']
})
export class AtozFilterComponent implements OnInit {

  

  @Output() onAlphaClick:EventEmitter<string>=new EventEmitter<string>();


 alphaArray:any=[
  { Name:'A',Value:'A'},
  { Name:'B',Value:'B'},
  { Name:'C',Value:'C'},
  { Name:'D',Value:'D'},
  { Name:'E',Value:'E'},
  { Name:'F',Value:'F'},
  { Name:'G',Value:'G'},
  { Name:'H',Value:'H'},
  { Name:'I',Value:'I'},
  { Name:'J',Value:'J'},
  { Name:'K',Value:'K'},
  { Name:'L',Value:'L'},
  { Name:'M',Value:'M'},
  { Name:'N',Value:'N'},
  { Name:'O',Value:'O'},
  { Name:'P',Value:'P'},
  { Name:'Q',Value:'Q'},
  { Name:'R',Value:'R'},
  { Name:'S',Value:'S'},
  { Name:'T',Value:'T'},
  { Name:'U',Value:'U'},
  { Name:'V',Value:'V'},
  { Name:'W',Value:'W'},
  { Name:'X',Value:'X'},
  { Name:'Y',Value:'Y'},
  { Name:'Z',Value:'Z'},
  { Name:'#',Value:'#'}
]
 


 constructor() {

 }
 

  ngOnInit(): void {
  }

  selectedAlpha:string="";
  onAlphaEmit(alpha){
    this.btnActiveStat=false;
    this.selectedAlpha=alpha;
    this.onAlphaClick.emit(alpha);
  }

  btnActiveStat:boolean=true;
  onAllClick(){
    this.btnActiveStat=true;
    this.selectedAlpha="";
    this.onAlphaClick.emit("");
  } 

}


