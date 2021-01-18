import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../Core/_providers/api-service/api.service';import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-system-defined',
  templateUrl: './add-system-defined.component.html',
  styleUrls: ['./add-system-defined.component.scss']
})
export class AddSystemDefinedComponent implements OnInit {

  addTermForm: FormGroup;
  submitted = false;
  public globalResponse: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private termSrvc: ApiService,
    ) { }

  ngOnInit(): void {
    this.addTermForm = this.formBuilder.group({
      rulename: ['', [Validators.required, Validators.pattern('[a-zA-Z# ]*')]],
     // dealer_id: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      dealer_id: [''],
      type:  ['S', [Validators.required]],
      status:  ['Y', [Validators.required]],
    }); 
  }

  onSubmit(){
    this.submitted = true;
    if (this.addTermForm.invalid) {
     return;
    }
    console.log(this.addTermForm.value);
    this.termSrvc.addIncentiveTerms(this.addTermForm.value).subscribe(
    response => {
      this.globalResponse = response;
      console.log(response);
      if(this.globalResponse.status === 200)
      {
        alert('Record added successfully');
        console.log(this.globalResponse)
        this.router.navigate(['incentiveTerms']);
      }

      else{
        alert('Please check the details');
      }
 });
}
}
