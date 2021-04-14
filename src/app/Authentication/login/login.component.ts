import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../Core/_providers/api-service/api.service';
import { LoginModel } from '../../Core/_models/login';
import { AlertifyService } from '../../Core/_providers/alert-service/alertify.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatDialog ,MatDialogConfig} from '@angular/material/dialog';
import { ForgotpasswordComponent } from '../../Authentication/login/forgotpassword/forgotpassword.component';
import { Cookie } from 'ng2-cookies/ng2-cookies';

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
  counter: any;
  submitted = false;

  rememberme: any = false;
  GETSIGNIN = true;
  newremeber: any;

  constructor(
    private apiSrvc: ApiService,
    private router: Router,
    private alertify: AlertifyService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {

    let uname = localStorage.getItem('userId');
    if (uname != '' && uname != undefined && uname != null) {
      this.router.navigate(['/dashboard']);
    } else {
      this.username = Cookie.get('userEmail');
      this.password = Cookie.get('userPassword');
      this.newremeber = Cookie.get('rememberMe');
      if(this.newremeber == "true"){
        this.rememberme = true;
      }
      else{
        this.rememberme = false;
      }
      
      if (this.username != null && this.password != null) {
        this.GETSIGNIN = false;
      }

      if (this.rememberme == null) {
        this.rememberme = false;
      }
    }

    
  }


  loggedIn() {
    return this.apiSrvc.loggedIn();
  }

  login() {
    if (this.form.invalid) {
      return false;
    }

    if (
      localStorage.getItem('counter') != null &&
      parseInt(localStorage.getItem('counter')) === 5
    ) {
      this.alertify.error('You have entered 5 consecutive invalid attempts');

      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.data = {
        name: this.username,  
      }
      const dialogRef = this.dialog.open(ForgotpasswordComponent, dialogConfig); {
        // width: '300px',
        // data: {},
        
      };
      localStorage.setItem('counter', '0');
      return;
    }

    const loginModel = new LoginModel(this.username, this.password);
    this.loading = true;
    this.apiSrvc.login(loginModel).subscribe(
      (res: any) => {
        if (res.status === 200) {
          const user = res.response;
          if (user) {
            localStorage.setItem('counter', '0');

            
            //localStorage.setItem('thrott_token', user.token);
            // console.log(user.token)
            //this.decodedToken = this.jwtHelper.decodeToken(user.token);
            // this.alertify.success('Logged in succesfully');
            //this.router.navigateByUrl('dashboard');
  
            // sessionStorage.setItem('thrott_token', user.token);
            // this.decodedToken = this.jwtHelper.decodeToken(user.token);

            // localStorage.setItem('thrott_token', user.token);
            // this.decodedToken = this.jwtHelper.decodeToken(user.token);
            // this.alertify.success('Logged in succesfully');
            // this.router.navigateByUrl('dashboard');

            if (this.rememberme == true) {
              localStorage.setItem('thrott_token', user.token);
              this.decodedToken = this.jwtHelper.decodeToken(user.token);
              localStorage.setItem('rememberMe', this.rememberme);
              Cookie.set('userEmail', this.username);
              Cookie.set('userPassword', this.password);
              Cookie.set('rememberMe', this.rememberme);

              this.router.navigateByUrl('dashboard');
            } else if (this.rememberme == false) {
              // localStorage.clear();
              sessionStorage.setItem('thrott_token', user.token);
              this.decodedToken = this.jwtHelper.decodeToken(user.token);

              localStorage.removeItem('rememberMe');
              Cookie.deleteAll();
            } else if (
              this.rememberme == true ||
              this.username != Cookie.get('userEmail') ||
              this.password != Cookie.get('userPassword')
            ) {
              Cookie.deleteAll();
              Cookie.set('userEmail', this.username);
              Cookie.set('userPassword', this.password);
              Cookie.set('rememberMe', this.rememberme);
            }
            // tslint:disable-next-line: max-line-length
            //  else if (this.rememberme == true || this.username != localStorage.get('userName') || this.password != localStorage.get('userPassword')) {
            //   localStorage.clear();
            //   localStorage.setItem('thrott_token', user.token);
            //   localStorage.set('rememberMe', this.rememberme);
            // }
            this.router.navigateByUrl('dashboard');
            this.alertify.success('Logged in succesfully');
          }
        }
        if (res.status !== 200) {

          this.alertify.error(res.error);
          let counter = parseInt(localStorage.getItem('counter'));
          if (counter == null) {
            counter = 0;
          }
          ++counter;
          localStorage.setItem('counter', '' + counter);
          
          localStorage.setItem('lastFailedDate', '' + Date.now());
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

  openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      name: this.username,  
    }
    const dialogRef = this.dialog.open(ForgotpasswordComponent, dialogConfig);{
      // width: '500px',
      // // height:'17vh',
      // data: {},
    };

    // dialogRef.afterClosed().subscribe(result => {
    //   const resp = JSON.parse(`${result}`);
    //   console.log('Dialog result:', resp);
    // });
  }

}
