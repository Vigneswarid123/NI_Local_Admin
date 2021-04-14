import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../Core/_providers/api-service/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-subscriptionPlan',
  templateUrl: './add-subscriptionPlan.component.html',
  styleUrls: ['./add-subscriptionPlan.component.scss']
})
export class AddSubscriptionPlanComponent implements OnInit {

  subPlanForm: FormGroup;
  submitted = false;
  public globalResponse: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private termSrvc: ApiService,
  ) { }

  ngOnInit() {
    this.subPlanForm = this.formBuilder.group({
      sp_name: ['', [Validators.required, Validators.pattern('[a-zA-Z# ]*'), Validators.maxLength(50)]],  
      sp_setupfee: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.maxLength(10)]],
      sp_monthlyfee: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.maxLength(10)]],
      sp_status: ['Y', [Validators.required]] 
    }); 
    console.log(this.subPlanForm.value);
  }

  OnSubmit(){
  this.submitted = true;
    if (this.subPlanForm.invalid) {
     return;
    }

  console.log(this.subPlanForm.value);
  this.termSrvc.addSubscriptionPlans(this.subPlanForm.value).subscribe(
    response => {
      this.globalResponse = response;
      console.log(response);
      if (this.globalResponse.status === 200)
      {
        alert('Record added successfully');
        console.log(this.globalResponse);
        this.router.navigate(['subscriptionPlans']);
      }

      else if
      (this.globalResponse.status === 401){
        alert(this.globalResponse.error);
      }

      else {
        alert('Please check the details');
      }
 });
}

  _keyPress(event: any) {
    const pattern = /[0-9+( )-]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  // statusValueChange($event: any) {  
  //   this.subPlanForm.controls['sp_status'].setValue($event.target.checked ? 'Y' : 'N');
  //   console.log(this.subPlanForm.value);
  // }

  }
