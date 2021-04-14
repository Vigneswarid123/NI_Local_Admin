import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../Core/_providers/api-service/api.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';



@Component({
  selector: 'app-grid-system-defined',
  templateUrl: './grid-system-defined.component.html',
  styleUrls: ['./grid-system-defined.component.scss']
})
export class GridSystemDefinedComponent implements OnInit {

  // incentiveTermsArray = [];
  Id: number;
  ID: number;
  term: any = [];
 // SearchText: any;

 hide: boolean = false;
 alphaSrch: string = '';
 atozFltr: boolean = false;
 TermsInfo: any=[];
 alphaColumns:any=["MIT_DISPLAYNAME"];
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
    this.router.navigateByUrl('incentiveTerms');
    this.incentiveTermsList();
  }


  incentiveTermsList(){
    this.SpinnerService.show();
    const obj = {
      itc_Id: 0
    };
    this.termSrvc.postmethod('incentivetermsandconditions/get', obj).subscribe((res:any)=>{
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

MIT_ID: number;
  Action(value) {
    this.term.push(value);
    console.log('editvalue', value)
    console.log('Id' + this.term[0].MIT_ID);
    this.ID = this.term[0].MIT_ID;
    console.log('editid', this.ID);
    this.router.navigate(['incentiveTermsEdit'], { queryParams: { MIT_ID: this.ID} });
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
