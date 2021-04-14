import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../Core/_providers/api-service/api.service';import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-incentiveType',
  templateUrl: './add-incentiveType.component.html',
  styleUrls: ['./add-incentiveType.component.scss']
})
export class AddIncentiveTypeComponent implements OnInit {

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
      incentivetype_name: ['', [Validators.required , Validators.pattern('[a-zA-Z# ]*')]],
      incentivetype_status: ['Y', [Validators.required]]
    }); 
    console.log(this.addTermForm.value);
  }

  onSubmit(){
    this.submitted = true;
    if (this.addTermForm.invalid) {
     return;
    }
    console.log(this.addTermForm.value);
    this.termSrvc.addIncentiveTypes(this.addTermForm.value).subscribe(
    response => {
      this.globalResponse = response;
      console.log(response);
      if(this.globalResponse.status === 200)
      {
        alert('Record added successfully');
        console.log(this.globalResponse)
        this.router.navigate(['incentiveTypes']);
      }

      else if (this.globalResponse.status === 401){
        alert(this.globalResponse.error);
      }
 });
}

// statusValueChange($event: any) {  
//   this.addTermForm.controls['incentivetype_status'].setValue($event.target.checked ? 'Y' : 'N');
//   console.log(this.addTermForm.value);
// }

}
