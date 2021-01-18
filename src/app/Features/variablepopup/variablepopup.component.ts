import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import {ApiService} from '../../Core/_providers/api-service/api.service';
import  {DatePipe} from '@angular/common';

@Component({
  selector: 'app-variablepopup',
  templateUrl: './variablepopup.component.html', 
  styleUrls: ['./variablepopup.component.scss']
})
export class VariablepopupComponent implements OnInit {
  regionsList: any=[];
  VariablepopupForm : FormGroup;
  VariableData: any=[];

  constructor(private fB: FormBuilder, private ApiService: ApiService, public dialogRef: MatDialogRef<VariablepopupComponent>) {
    this.VariablepopupForm = this.fB.group({
      availbonus: [''],
      region:[''],
      datefrom : [''],
      dateto : ['']
    });
   }

  ngOnInit(): void {
    this.getRegions();
  }
  getRegions(){
    const obj = {
      region_id: 0
    };
   this.ApiService.postmethod('regions/get',obj).subscribe((res:any)=>{
     if(res.status == 200){
       this.regionsList = res.response;
     }
   })
  }
  closeVariablePopup(){
    this.dialogRef.close();
  }
  addVaribleData(){
   
    const varobj={
      availablebonus: this.VariablepopupForm.value.availbonus,
      regionval:this.VariablepopupForm.value.region,
      datefrom : new DatePipe('en-US').transform(this.VariablepopupForm.value.datefrom, 'dd/MM/yyyy'),
      dateto : new DatePipe('en-US').transform(this.VariablepopupForm.value.dateto, 'dd/MM/yyyy'),
      value : "100"
    };
    this.VariableData=varobj;
    this.dialogRef.close(this.VariableData);

  }
  onkeyPress(event:any){
    const pattern = /[0-9+( )-]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

}
