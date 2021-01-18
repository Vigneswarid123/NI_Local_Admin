import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../Core/_providers/api-service/api.service';
import { AlertifyService } from '../../../Core/_providers/alert-service/alertify.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-grid-users',
  templateUrl: './grid-users.component.html',
  styleUrls: ['./grid-users.component.scss']
})
export class GridUsersComponent implements OnInit {

  User_Id: number;
  id: number;
  user: any = [];
  SearchText: any;
  users = [];

  hide:boolean=false;
  alphaSrch:string='';
  atozFltr:boolean=false;
  UserInfo:any=[];
  alphaColumns:any=["User_Firstname", "User_Lastname"];
  SearchUsersForm: FormGroup;

  config: any;
  constructor(
    private fB: FormBuilder,
    private userSrvc: ApiService,
    private alertify: AlertifyService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) { 
    this.SearchUsersForm =this.fB.group({
      txtSearch:""
    });
  }

  ngOnInit(): any {
    this.showUsers();

    this.config = {
      itemsPerPage: 10,
      currentPage: 1,
    };
  }

  showUsers(): any {
    this.spinner.show();
    const obj = {
      User_Id: 0,
    };

    // console.log(obj);

    this.userSrvc.getUsers(obj).subscribe((res: any) => {
      if (res.status === 200) {
        const user = res.response;

        if (user) {
          // this.users = res.response;
          var k: string | number,
            arr = [];
          let obj = res;
          for (k in obj.response) {
            var item = obj.response[k];
            arr.push({
              User_Email: item.User_Email,
              User_Firstname: item.User_Firstname,
              User_Id: item.User_Id,
              User_Lastname: item.User_Lastname,
              User_Status: item.User_Status,
              User_Roleid: item.User_Roleid,
              User_RoleName: item.User_RoleName,
              User_Profileimage:
                'http://niapi.local.com/api/resources/images/' +
                item.User_Profileimage,
            });
          }
          this.users = arr;
          this.UserInfo = arr;
          this.spinner.hide();
          // this.users = this.users.filter(usr => usr.Status === 'Y');

          // console.log(user);
        }
      } else {
        this.alertify.error(res.message);
        this.spinner.hide();
      }
    });
  }

  Action(value) {
    this.user.push(value);
    console.log('id' + this.user[0].User_Id);
    this.id = this.user[0].User_Id;
    console.log(this.id);
    this.router.navigate(['editusers'], { queryParams: { User_Id: this.id } });
  }

  onAlphaCatch(alphabet){
    this.hide=true;
    this.atozFltr=true;
    this.alphaSrch=alphabet;
     
  }

  onSearch(){
    this.alphaSrch= this.SearchUsersForm.controls['txtSearch'].value;
  }

  atoZClick(){
    if(!this.atozFltr)
    this.atozFltr=true;
    else
    this.atozFltr=false;
  }


}
