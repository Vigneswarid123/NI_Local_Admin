import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AlertifyService } from '../../Core/_providers/alert-service/alertify.service';
import jwt_decode from 'jwt-decode';
import {ApiService} from '../../Core/_providers/api-service/api.service';
import { NgxSpinnerService } from "ngx-spinner"; 


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  
  route: any;
  getdealershipgroups: any = [];
  divActive: any = 0;
  dlgrpDetails: any = [];
  noDealerGroup: boolean=false;
  
   constructor(private apiSrvc: ApiService, private router: Router, private alertify: AlertifyService, private SpinnerService: NgxSpinnerService) {
     
 
    this.Dealershipgroups();

  }

  ngOnInit(): void {
    this.router.navigateByUrl('dashboard');
  }


  Dealershipgroups() {
    this.SpinnerService.show();
    const dealergroupObj = {
      "dealergroupid": 0,
      "expression": "dg_status = 'Y'"
    };

    this.apiSrvc.GetDealershipGroupsData(dealergroupObj).subscribe((resp: any) => {
      console.log('Get groups Resp', resp);
      if (resp.status == 200) {
        if(resp.response[0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B'] !=""){
        this.getdealershipgroups = JSON.parse(resp.response[0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B']);
        console.log('DealerGroups', this.getdealershipgroups);
        
        }
        else{
           this.noDealerGroup=true;
           
        }
        this.SpinnerService.hide();
      }
    
    });

   
    // this.apiSrvc.GetDealershipGroupsData(dealergroupObj).subscribe(
    //   (response: any) => {
    //     if (response.message == "success") {
    //       this.getdealershipgroups = response;
    //     }
    //   });

  }

  dlgroupDetails(dt, ind) {
    this.divActive = ind;
    this.dlgrpDetails = dt;
    console.log('Details:', dt);
  }

}
