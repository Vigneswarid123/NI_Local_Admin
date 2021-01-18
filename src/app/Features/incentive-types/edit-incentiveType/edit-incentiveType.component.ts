import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../Core/_providers/api-service/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { incentiveTypesModel } from '../../../Core/_models/incentiveTypes';


@Component({
  selector: 'app-edit-incentiveType',
  templateUrl: './edit-incentiveType.component.html',
  styleUrls: ['./edit-incentiveType.component.scss']
})
export class EditIncentiveTypeComponent implements OnInit {

  addTermForm: FormGroup;
  submitted = false;
  loading = false;
  incentivetype_id: number;
  public globalResponse: any = [];
  termDetails: any = [];
 
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private termSrvc: ApiService
    ) 
    {
      this.route.queryParams.subscribe(params => {
        this.incentivetype_id = params.incentivetype_id;
        console.log(this.incentivetype_id);
   });
   }

  ngOnInit(): void {
    this.termEditForm();
    this.addTermForm = this.formBuilder.group({
      incentivetype_name: ['', [Validators.required]],  
      incentivetype_status: [''],
    });    
   }

   termEditForm(){
    this.termSrvc.getIncentiveTypesById(this.incentivetype_id).subscribe(
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
    const termUpdate = new incentiveTypesModel(
      this.termDetails.incentivetype_id,
      this.termDetails.incentivetype_name,
      this.termDetails.incentivetype_status
    );
    this.termSrvc.updateIncentiveTypes(termUpdate).subscribe((res: any) => {
      console.log('res', res);
      if (res.status === 200) {
        alert('Record updated successfully');
        this.router.navigate(['incentiveTypes']);
      }
      else {
        alert('Please check the details');
      }
    });
  }
  
  handleStatus(evt) {
    let target = evt.target;
    if (target.checked) {
    this.termDetails.incentivetype_status = "Y";
    } else {
    this.termDetails.incentivetype_status = "N";
    }
    console.log (this.addTermForm.value)
    }

}
