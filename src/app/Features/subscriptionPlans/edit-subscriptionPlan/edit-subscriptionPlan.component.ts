import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../Core/_providers/api-service/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { subscriptionPlansModel } from '../../../Core/_models/subscriptionPlans';


@Component({
  selector: 'app-edit-subscriptionPlan',
  templateUrl: './edit-subscriptionPlan.component.html',
  styleUrls: ['./edit-subscriptionPlan.component.scss']
})
export class EditSubscriptionPlanComponent implements OnInit {

  subPlanForm: FormGroup;
  submitted = false;
  public globalResponse: any = [];
  loading = false;
  sp_id: number;
  planDetails: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private termSrvc: ApiService,
  ) 
  { 
    this.route.queryParams.subscribe(params => {
      this.sp_id = params.sp_id;
      console.log(this.sp_id);
 });
  }

  ngOnInit() {
    this.planEditForm();
    this.subPlanForm = this.formBuilder.group({
      sp_name: ['', [Validators.required, Validators.pattern('[a-zA-Z# ]*')]],  
      sp_setupfee: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      sp_monthlyfee: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      sp_status: ['']
    });
    console.log(this.subPlanForm.value);
  }

  OnSubmit(){
  this.submitted = true;
    if (this.subPlanForm.invalid) {
     return;
    }
  }

  planEditForm(){
    this.termSrvc.getSubscriptionPlansById(this.sp_id).subscribe(
      response => {
        this.globalResponse = response;
        this.planDetails = this.globalResponse.response[0];
        console.log(this.planDetails);
      });
  }

  updatePlans(): any {
    {
      this.submitted = true;
    if (this.subPlanForm.invalid) {
     return;

    }
    }
    const termUpdate = new subscriptionPlansModel(
      this.planDetails.sp_id,
      this.planDetails.sp_name,
      this.planDetails.sp_setupfee,
      this.planDetails.sp_monthlyfee,
      this.planDetails.sp_status
    );
    this.termSrvc.updateSubscriptionPlans(termUpdate).subscribe((res: any) => {
      console.log('res', res);
      if (res.status === 200) {
        alert('Record updated successfully');
        this.router.navigate(['subscriptionPlans']);
      }
      else {
        alert('Please check the details');
      }
    });
  }

  handleStatus(evt) {
    let target = evt.target;
    if (target.checked) {
    this.planDetails.sp_status = 'Y';
    } else {
    this.planDetails.sp_status = 'N';
    }
    }

  _keyPress(event: any) {
    const pattern = /[0-9+( )-]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }



}