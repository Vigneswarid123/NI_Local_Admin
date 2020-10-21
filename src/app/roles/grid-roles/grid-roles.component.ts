import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../_services/api.service";
import { Router } from '@angular/router';
// import { AlertifyService } from '../../_services/alertify.service';

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

  constructor(
    private roleSrvc: ApiService,
    private router: Router,
   // private alertify: AlertifyService,
    ) { }

  ngOnInit(): void {
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
    const obj = {
      Role_Id: 0
    };
  this.roleSrvc.showRolesData(obj).subscribe((res: any) => {
    if (res.status === 200) {
      const roles = res.response;
      if (roles) {
        this.rolesArray = res.response;
        console.log(roles);
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

}
