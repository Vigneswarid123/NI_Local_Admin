import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import jwt_decode from 'jwt-decode';
import {ApiService} from '../_services/api.service';


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
  
   constructor(private apiSrvc: ApiService, private router: Router, private alertify: AlertifyService) {
     
 
    this.Dealershipgroups();

  }

  ngOnInit(): void {
  }


  Dealershipgroups() {
    const dealergroupObj = {
      "dealergroupid": 0,
      "expression": "dg_status = 'A'"
    };

    // this.apiSrvc.GetDealershipGroupsData(dealergroupObj).subscribe((resp: any) => {
    //   console.log('Get groups Resp', resp);
    //   if (resp.status == 200) {
    //     this.getdealershipgroups = JSON.parse(resp.response[0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B']);
    //     console.log('DealerGroups', this.getdealershipgroups);
    //   }
    // });

    this.apiSrvc.GetDealershipGroupsData(dealergroupObj).subscribe(
      (response: any) => {
        if (response.message == "success") {
          this.getdealershipgroups = response;
        }
      });

  }

  dlgroupDetails(dt, ind) {
    this.divActive = ind;
    this.dlgrpDetails = dt;
    console.log('Details:', dt);
  }

}
