import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { ApiService } from '../../../Core/_providers/api-service/api.service';
import { roleModel } from '../../../Core/_models/role';
import { AlertifyService } from '../../../Core/_providers/alert-service/alertify.service';




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
  constructor(  private formBuilder: FormBuilder, private router: Router,private route: ActivatedRoute, private roleSrvc:ApiService, private alertify: AlertifyService) {
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
      Role_Front:  ['', [Validators.required]],
      Role_Portal:  ['N', [Validators.required]],
      Role_Status: ['', [Validators.required]]
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

  updateRoles(): any {
    const roleUpdate = new roleModel(
      this.RoleDetails.Role_Name,
      this.RoleDetails.Role_UniqId,
       this.RoleDetails.Role_Id,
       this.RoleDetails.Role_Admin,
       this.RoleDetails.Role_Status,
       this.RoleDetails.Role_Portal,
       this.RoleDetails.Role_Front
    );
    this.roleSrvc.updateRole(roleUpdate).subscribe((res: any) => {
      console.log('res', res);
      if (res.status === 200) {
        this.alertify.success('Record updated successfully');
        this.router.navigate(['Roles']);
      } 
      else {
        this.alertify.error('Please check the details');
      }
    });
  }

//   onSubmit(){
//     this.submitted = true;

//     if (this.addRoleForm.invalid) {
//      return;
//     }
// this.editRole=this.addRoleForm.value;

//     const obj={
//       Role_Id:this.Role_Id,
//       Role_Name:this.editRole.Role_Name ,
//       Role_UniqId:this.editRole.Role_UniqId    
//     }

//     this.roleSrvc.updateRole(obj).subscribe( response => {
//       this.globalResponse = response;
//       if(this.globalResponse.status==200){
//         alert("role updated successfully");
//         console.log(this.globalResponse)
//       }
//   });
//   }
  
}


