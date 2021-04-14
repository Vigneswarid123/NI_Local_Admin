import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AlertifyService } from '../../Core/_providers/alert-service/alertify.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ApiService } from '../../Core/_providers/api-service/api.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  decodedToken: any;
  jwtHelper = new JwtHelperService();
  RoleName: any;
  loginUsername: any;
  UserLoginImage: any;
  UserId: any;
  getroleNames: any = [];
  roleSName: any;

  constructor(private router: Router, private alertify: AlertifyService, private apiSrvc: ApiService) {
    this.roleNames();
  }

  ngOnInit(): void {
    const token = localStorage.getItem('thrott_token');
    this.decodedToken = this.jwtHelper.decodeToken(token);

    this.RoleName = (this.decodedToken.RoleId);
    this.UserLoginImage = (`${environment.apiUrl}`+'resources/images/' + this.decodedToken.ProfileImage);


    this.UserId = (this.decodedToken.UserId);
    this.loginUsername = (this.decodedToken.FirstName + ' ' + this.decodedToken.LastName);
  }

  roleNames() {
    const rolesValues = {
      'Role_Id': '0',
      'expression': ''
    };
    this.apiSrvc.getRolesData(rolesValues).subscribe((resp: any) => {
      console.log('get roles data', resp);
      if (resp.status == 200) {
        this.getroleNames = resp.response;
        console.log('get roles names', this.getroleNames);
        this.roleSName = this.getroleNames.filter(Role => Role.Role_UniqId == this.RoleName)[0].Role_Name;
        console.log('roleS', this.roleSName);
      }
    });

  }

  LogOut() {
    localStorage.removeItem('thrott_token');
    sessionStorage.removeItem('thrott_token');
    // this.router.navigate(['Login']);
    this.router.navigateByUrl('login');
    this.alertify.error('Logged Out Succesfully');

  }

  editUser(UserId) {
    this.router.navigate(['/editusers'], { queryParams: { UserId: this.UserId } });
  }

}
