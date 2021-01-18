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
      Role_Name: ['', [Validators.required,Validators.pattern('[a-zA-Z# ]*'),Validators.maxLength(50)]],
      Role_UniqId: ['', [Validators.required,Validators.pattern('[0-9]*'),Validators.maxLength(5)]],
      Role_Front:  ['', [Validators.required]],
      Role_Admin:  ['', [Validators.required]],
      Role_Portal:  ['N', [Validators.required]],
      Role_Status: ['Y', [Validators.required]]
    }); 
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
      if(this.globalResponse.status==200){
        this.alertify.success("Record added successfully");
        console.log(this.globalResponse)
        this.router.navigate(['Roles']); 
      }     

      else{
        this.alertify.error('Please check the details');
      }
 
  });
}

}
