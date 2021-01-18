import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import {ApiService} from '../../Core/_providers/api-service/api.service';
import { LoginModel } from '../../Core/_models/login';
import { AlertifyService } from '../../Core/_providers/alert-service/alertify.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  @ViewChild('form') form: NgForm;

  decodedToken: any;
  jwtHelper = new JwtHelperService();
  loading = false;


  constructor(
    private apiSrvc: ApiService,
    private router: Router,
    private alertify: AlertifyService
  ) {}

  ngOnInit(): void {}

  loggedIn() {
    return this.apiSrvc.loggedIn();
  }

  login() {
    if (this.form.invalid) { return false; }
    const loginModel = new LoginModel(this.username, this.password);
    this.loading = true;
    this.apiSrvc.login(loginModel).subscribe((res: any) => {
        if (res.status === 200){
          const user = res.response;
          if (user) {
          localStorage.setItem('thrott_token', user.token);
          this.decodedToken = this.jwtHelper.decodeToken(user.token);
          this.alertify.success('Logged in succesfully');
          this.router.navigateByUrl('dashboard');
          }
      }
      else{
        this.alertify.error(res.error);
      }
        this.loading = false;
    }
    // ,
    //   (err) => this.alertify.error(err.statusText),
    //   () => {
    //     this.router.navigateByUrl('dashboard');
    //   }
    );
  }
}
