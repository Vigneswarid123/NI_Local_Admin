import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../Core/_providers/api-service/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-grid-subscriptionPlan',
  templateUrl: './grid-subscriptionPlan.component.html',
  styleUrls: ['./grid-subscriptionPlan.component.scss']
})
export class GridSubscriptionPlanComponent implements OnInit {

  subscriptionPlansArray = [];
  sp_id: number;
  ID: number;
  term: any = [];
  SearchText: any;

  constructor(
    private termSrvc: ApiService,
    private router: Router,
    ) { }

  ngOnInit(): void {
    this.subscriptionPlansList();
  }


  subscriptionPlansList(){
    const obj = {
      sp_id: "0",
      expression: ""
    };
    this.termSrvc.showSubscriptionPlans(obj).subscribe((res: any) => {
    if (res.status === 200) {
      const terms = res.response;
      if (terms) {
        this.subscriptionPlansArray = res.response;
        console.log(terms);
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

}

