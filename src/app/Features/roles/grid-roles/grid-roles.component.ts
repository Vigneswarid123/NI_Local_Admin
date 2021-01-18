import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../Core/_providers/api-service/api.service';
import { Router } from '@angular/router';
// import { AlertifyService } from '../../_services/alertify.service';
import { NgxSpinnerService } from "ngx-spinner"; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-grid-roles',
  templateUrl: './grid-roles.component.html',
  styleUrls: ['./grid-roles.component.scss']
})
export class GridRolesComponent implements OnInit {

  rolesArray = [];
  config: any;
  Role_Id:number;
  id:number;
  role:any=[];

  hide:boolean=false;
  alphaSrch:string='';
  atozFltr:boolean=false;
  RolesInfo:any=[];
  alphaColumns:any=["Role_Name"];
  SearchRolesForm: FormGroup;
  

  constructor(
    private fB: FormBuilder,
    private roleSrvc: ApiService,
    private router: Router,
    private SpinnerService: NgxSpinnerService
   // private alertify: AlertifyService,
    ) {
       this.SearchRolesForm =this.fB.group({
        txtSearch:""
      });
     }
 
    
  ngOnInit(): void {
    
    this.router.navigateByUrl('Roles');
    this.rolesList();
 
    // pagination
    this.config = {
      itemsPerPage: 10,
      currentPage: 1
    };
  }

  //pagination

  pageChanged(event){
    this.config.currentPage = event;
  }


  rolesList(){
    this.SpinnerService.show();

    const obj = {
      Role_Id: 0
    };
  this.roleSrvc.showRolesData(obj).subscribe((res: any) => {
    if (res.status === 200) {
      const roles = res.response;
      if (roles) {
        this.rolesArray = res.response;
        this.RolesInfo = res.response;
        console.log(roles);
        this.SpinnerService.hide();

      }
}
    else {
      //this.alertify.error(res.message);
    }
  });
}

Action(value) {
  this.role.push(value);
  console.log('id' + this.role[0].Role_Id);
  this.id = this.role[0].Role_Id;
  console.log(this.id);
  this.router.navigate(['rolesEdit'], { queryParams: { Role_Id: this.id} });
  }


  onAlphaCatch(alphabet){
    this.hide=true;
    this.atozFltr=true;
    this.alphaSrch=alphabet;
     
  }

  onSearch(){
    this.alphaSrch= this.SearchRolesForm.controls['txtSearch'].value;
  }

  atoZClick(){
    if(!this.atozFltr)
    this.atozFltr=true;
    else
    this.atozFltr=false;
  }


}
