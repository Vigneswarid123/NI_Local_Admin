import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AlertifyService } from '../../Core/_providers/alert-service/alertify.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router, private alertify: AlertifyService) { }

  ngOnInit(): void {
  }

  LogOut(){
    localStorage.removeItem('thrott_token');
    // this.router.navigate(['Login']);
    this.router.navigateByUrl('login');
    this.alertify.error('Logged Out Succesfully');
   
  }

}
