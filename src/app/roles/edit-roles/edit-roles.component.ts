import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { ApiService } from "../../_services/api.service";


@Component({
  selector: 'app-edit-roles',
  templateUrl: './edit-roles.component.html',
  styleUrls: ['./edit-roles.component.scss']
})
export class EditRolesComponent implements OnInit {

  public globalResponse: any = [];
  public editRole: any = [];
  addRoleForm: FormGroup;
  submitted = false;
  loading = false;
  Role_Id:number;
 
  RoleDetails: any=[];
  constructor(  private formBuilder: FormBuilder, private router: Router,private route: ActivatedRoute, private roleSrvc:ApiService) {
    this.route.queryParams.subscribe(params => {
       this.Role_Id = params.Role_Id;
    console.log(this.Role_Id)
  });

   }

  ngOnInit(): void {
    this.roleEditForm();
    this.addRoleForm = this.formBuilder.group({
      Role_Name: ['', [Validators.required,Validators.pattern('[a-zA-Z# ]*'),Validators.maxLength(50)]],
      Role_UniqId: ['', [Validators.required,Validators.pattern('[0-9]*'),Validators.maxLength(5)]],
      Role_Admin:  ['', [Validators.required]],
      Role_Status: ['Y', [Validators.required]]
    }); 
  }
  roleEditForm(){
    this.roleSrvc.getRole(this.Role_Id).subscribe(
      response => {
        this.globalResponse = response;
        this.RoleDetails=this.globalResponse.response[0];
        console.log(this.RoleDetails);
      });
  }

}