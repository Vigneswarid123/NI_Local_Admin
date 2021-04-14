import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../Core/_providers/api-service/api.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner"; 

@Component({
  selector: 'app-grid-incentiveType',
  templateUrl: './grid-incentiveType.component.html',
  styleUrls: ['./grid-incentiveType.component.scss']
})
export class GridIncentiveTypeComponent implements OnInit {

 // incentiveTypesArray = [];
  incentivetype_id: number;
  ID: number;
  term: any = [];
 // SearchText: any;

 hide: boolean = false;
 alphaSrch: string = '';
 atozFltr: boolean = false;
 TermsInfo: any=[];
 alphaColumns:any=["incentivetype_name"];
 SearchTermsForm: FormGroup;

  constructor(
    private termSrvc: ApiService,
    private router: Router,
    private fB: FormBuilder,
    private SpinnerService: NgxSpinnerService
    ) 
    {
      this.SearchTermsForm =this.fB.group({
       txtSearch:""
     });
    }

  ngOnInit(): void {
    this.router.navigateByUrl('incentiveTypes');
    this.incentiveTypesList();
  }


  incentiveTypesList(){
    this.SpinnerService.show();
    const obj = {
      incentivetype_id: "0",
      expression: ""
    };
    this.termSrvc.showIncentiveTypes(obj).subscribe((res: any) => {
    if (res.status === 200) {
      const terms = res.response;
      if (terms) {
        this.TermsInfo = res.response;
        console.log(terms);
        this.SpinnerService.hide();
      }
}
  });
}

  Action(value) {
    this.term.push(value);
    console.log('Id' + this.term[0].incentivetype_id);
    this.ID = this.term[0].incentivetype_id;
    console.log(this.ID);
    this.router.navigate(['incentiveTypesEdit'], { queryParams: { incentivetype_id: this.ID} });
    }

    onAlphaCatch(alphabet){
      this.hide=true;
      this.atozFltr=true;
      this.alphaSrch=alphabet;
       
    }
  
    onSearch(){
      this.alphaSrch= this.SearchTermsForm.controls['txtSearch'].value;
    }
  
    atoZClick(){
      if(!this.atozFltr)
      this.atozFltr=true;
      else
      this.atozFltr=false;
    }
  

}

