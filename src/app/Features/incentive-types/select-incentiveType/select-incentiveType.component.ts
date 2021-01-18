import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../Core/_providers/api-service/api.service';


@Component({
  selector: 'app-select-incentiveType',
  templateUrl: './select-incentiveType.component.html',
  styleUrls: ['./select-incentiveType.component.scss']
})
export class SelectIncentiveTypeComponent implements OnInit {

  incentiveTypesArray = [];

  constructor(
    private termSrvc: ApiService,
    private router: Router,
  ) { }

  ngOnInit( )
  {
    this.incentiveTypesList();
  }

  incentiveTypesList(){
    const obj = {
      incentivetype_id: "0",
      expression: ""
    };
    this.termSrvc.showIncentiveTypes(obj).subscribe((res: any) => {
    if (res.status === 200) {
      const terms = res.response;
      if (terms) {
        this.incentiveTypesArray = res.response;
        console.log(terms);
      }
}
  });
}

 // ------------------------using checkbox selection

 selectedTermsArray: string[] = [];
 isfrmChecked:any;
 
 onCheckboxChange(isChecked, value) {
   if (isChecked) {
     this.selectedTermsArray.push(value);
   } else {
     let index = this.selectedTermsArray.indexOf(value);
     this.selectedTermsArray.splice(index, 1);
   }
 }
 
 removeOnCloseClick(index, value) {
   this.selectedTermsArray.splice(index, 1);
   this.incentiveTypesArray.map((x) => {
     if (x.incentivetype_name === value) {
       x.isChecked = false;
     }
   });
 }

}
