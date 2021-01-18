import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../Core/_providers/api-service/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { incentiveTermsModel } from '../../../Core/_models/incentiveTerms';


@Component({
  selector: 'app-edit-system-defined',
  templateUrl: './edit-system-defined.component.html',
  styleUrls: ['./edit-system-defined.component.scss']
})

export class EditSystemDefinedComponent implements OnInit {

  addTermForm: FormGroup;
  submitted = false;
  loading = false;
  Id: number;
  public globalResponse: any = [];
  termDetails: any = [];

  // public editTerm: any = [];
 
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private termSrvc: ApiService
    ) 
    {
      this.route.queryParams.subscribe(params => {
        this.Id = params.Id;
        console.log(this.Id);
   });
   }

  ngOnInit(): void {
    this.termEditForm();
    this.addTermForm = this.formBuilder.group({
      RuleName: ['', [Validators.required]],
     // Dealer_Id: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      Type:  ['', [Validators.required]],
      Status:  ['', [Validators.required]],
    });
   }

   termEditForm(){
    this.termSrvc.getIncentiveTermsById(this.Id).subscribe(
      response => {
        this.globalResponse = response;
        this.termDetails = this.globalResponse.response[0];
        console.log(this.termDetails);
      });
  }


  
  updateTerms(): any {
    {
      this.submitted = true;  
      if (this.addTermForm.invalid) {
       return;
      }
    }

    const termUpdate = new incentiveTermsModel(
      this.termDetails.Id,
      this.termDetails.RuleName,
       this.termDetails.Dealer_Id,
       this.termDetails.Type,
       this.termDetails.Status
    );
    this.termSrvc.updateIncentiveTerms(termUpdate).subscribe((res: any) => {
      console.log('res', res);
      if (res.status === 200) {
        alert('Record updated successfully');
        this.router.navigate(['incentiveTerms']);
      }
      else {
        alert('Please check the details');
      }
    });
  }
  
}
