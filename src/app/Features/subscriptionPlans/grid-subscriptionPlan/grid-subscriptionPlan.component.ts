import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../Core/_providers/api-service/api.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner"; 

@Component({
  selector: 'app-grid-subscriptionPlan',
  templateUrl: './grid-subscriptionPlan.component.html',
  styleUrls: ['./grid-subscriptionPlan.component.scss']
})
export class GridSubscriptionPlanComponent implements OnInit {

  // subscriptionPlansArray = [];
  sp_id: number;
  ID: number;
  term: any = [];
 // SearchText: any;

 hide: boolean = false;
 alphaSrch: string = '';
 atozFltr: boolean = false;
 PlansInfo: any=[];
 alphaColumns:any=["sp_name"];
 SearchPlansForm: FormGroup;

  constructor(
    private termSrvc: ApiService,
    private router: Router,
    private fB: FormBuilder,
    private SpinnerService: NgxSpinnerService
    ) 
    {
      this.SearchPlansForm =this.fB.group({
       txtSearch:""
     });
    }

  ngOnInit(): void {
    this.router.navigateByUrl('subscriptionPlans');
    this.subscriptionPlansList();
  }


  subscriptionPlansList(){
    this.SpinnerService.show();
    const obj = {
      sp_id: "0",
      expression: ""
    };
    this.termSrvc.showSubscriptionPlans(obj).subscribe((res: any) => {
    if (res.status === 200) {
      const terms = res.response;
      if (terms) {
        this.PlansInfo = res.response;
        console.log(terms);
        this.SpinnerService.hide();
      }
}
  });
}

Action(value) {
  this.term.push(value);
  console.log('Id' + this.term[0].sp_id);
  this.ID = this.term[0].sp_id;
  console.log(this.ID);
  this.router.navigate(['subscriptionPlansEdit'], { queryParams: { sp_id: this.ID} });
  }

  // deletePlan(sp_id: number): any {
  //   this.termSrvc.deleteSubscriptionPlan(sp_id).subscribe((res: any) => {
  //     console.log('res', res);
  //     if (res.status === 200) {
  //       this.ngOnInit();
  //       alert('Record deleted succesfully');
  //     }
  //     else {
  //       alert(res.message);
  //     }
  //   });
  // }

  deletedplan:any=[];
  delete(val){
    if (confirm('Are you sure to delete ?'))
    {
    this.deletedplan = val;
    console.log(this.deletedplan);
    this.sp_id = this.deletedplan.sp_id;
    console.log(this.sp_id);
    const obj = {
    sp_id: this.sp_id
   };
    this.termSrvc.deleteSubscriptionPlan(obj).subscribe( response => {
       console.log(response);
       alert('Record deleted successfully');
       window.location.reload();
     });
   }
  }

  onAlphaCatch(alphabet){
    this.hide=true;
    this.atozFltr=true;
    this.alphaSrch=alphabet;
     
  }

  onSearch(){
    this.alphaSrch= this.SearchPlansForm.controls['txtSearch'].value;
  }

  atoZClick(){
    if(!this.atozFltr)
    this.atozFltr=true;
    else
    this.atozFltr=false;
  }

}

