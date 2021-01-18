import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AlertifyService } from '../../Core/_providers/alert-service/alertify.service';
import {ApiService} from '../../Core/_providers/api-service/api.service';


@Component({
  selector: 'app-temp-dashboard',
  templateUrl: './temp-dashboard.component.html',
  styleUrls: ['./temp-dashboard.component.scss']
})
export class TempDashboardComponent implements OnInit {
  text: string = 'Ramesh';

  alphebets = [
    { "alpha" :"All"},
    { "alpha" :"A"},
    { "alpha" :"B"},
    { "alpha" :"C"},
    { "alpha" :"D"},
    { "alpha" :"E"},
    { "alpha" :"F"},
    { "alpha" :"G"},
    { "alpha" :"H"},
    { "alpha" :"I"},
    { "alpha" :"J"},
    { "alpha" :"K"},
    { "alpha" :"L"},
    { "alpha" :"M"},
    { "alpha" :"N"},
    { "alpha" :"O"},
    { "alpha" :"P"},
    { "alpha" :"Q"},
    { "alpha" :"R"},
    { "alpha" :"S"},
    { "alpha" :"T"},
    { "alpha" :"U"},
    { "alpha" :"V"},
    { "alpha" :"W"},
    { "alpha" :"X"},
    { "alpha" :"Y"},
    { "alpha" :"Z"},
    { "alpha" :"#"},
    
   ]

   login : any;
   constructor(private apiSrvc: ApiService, private router: Router, private alertify: AlertifyService) {
     
  }

  ngOnInit(): void {
  }


  // LogOut(){
  //   localStorage.removeItem('thrott_token');
  //   // this.router.navigate(['Login']);
  //   this.router.navigateByUrl('login');
  //   this.alertify.error('Logged Out Succesfully');
   
  // }

  Adddealership(){
    // this.router.navigate(['AddDealership']);
   }
   AddGroupdealership(){
    // this.router.navigate(['AddGroupDealership']);
   }
}
