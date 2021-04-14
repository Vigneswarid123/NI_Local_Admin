import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../Core/_providers/api-service/api.service';
import { AlertifyService } from '../../../Core/_providers/alert-service/alertify.service';


@Component({
  selector: 'app-add-roles',
  templateUrl: './add-roles.component.html',
  styleUrls: ['./add-roles.component.scss']
})
export class AddRolesComponent implements OnInit {

  addRoleForm: FormGroup;
  submitted = false;
  public globalResponse: any = [];
  constructor(private formBuilder: FormBuilder, private router: Router,private route: ActivatedRoute, private roleSrvc:ApiService, private alertify: AlertifyService) { }

  ngOnInit(): void {
    this.addRoleForm = this.formBuilder.group({
      Role_Name: ['', [Validators.required,Validators.pattern('[a-zA-Z# ]*')]],
      // Role_UniqId: ['', [Validators.required,Validators.pattern('[0-9]*'), Validators.maxLength(5)]],
      Role_Front:  ['', [Validators.required]],
      Role_Admin:  ['', [Validators.required]],
      Role_Portal:  ['N', [Validators.required]],
      Role_Status: ['Y', [Validators.required]]
    }); 
    console.log(this.addRoleForm.value);
  }

  onSubmit(){
    this.submitted = true;
    if (this.addRoleForm.invalid) {
     return;
    }
    console.log(this.addRoleForm.value);
    this.roleSrvc.addRole(this.addRoleForm.value).subscribe(
    response => {
      this.globalResponse = response;
      console.log(response);
      if (this.globalResponse.status === 200){
        alert('Record added successfully');
        console.log(this.globalResponse)
        this.router.navigate(['Roles']); 
      }

      else if (this.globalResponse.status === 401){
        alert('Role Already Exists');
      }
 
  });
}

onCancel(){
  this.router.navigate(['Roles']);
}

// statusValueChange($event: any) {  
//   this.addRoleForm.controls['Role_Status'].setValue($event.target.checked ? 'Y' : 'N');
//   console.log(this.addRoleForm.value);
// }



}
