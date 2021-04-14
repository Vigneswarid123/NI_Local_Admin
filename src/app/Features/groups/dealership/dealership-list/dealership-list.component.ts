import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../Core/_providers/api-service/api.service';
import { Router } from '@angular/router';
import { AdminServiceService } from '../../../../Core/_providers/admin-service/admin-service.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { environment } from '../../../../../environments/environment';


@Component({
  selector: 'app-dealership-list',
  templateUrl: './dealership-list.component.html',
  styleUrls: ['./dealership-list.component.scss']
})
export class DealershipListComponent implements OnInit {
  fullUrl = `${environment.apiUrl}`; 
  public globalResponse: any = [];
  obj: any = [];
  dealersDetails: any = [];
  GetDealershipsList: any = [];
  divActive: any = 0;
  id: any;
  getdgroups: any;
  getstatesresp: any = [];
  sub: any;
  dealergrpid: any;
  conts: any;
  users: any;


  constructor(private authService: ApiService, private router: Router, private activatedRoute: ActivatedRoute, private SpinnerService: NgxSpinnerService) {
    this.id = this.activatedRoute.snapshot.params.id;

    this.getStatesData();
  }

  ngOnInit(): void {
    this.sub = this.activatedRoute.paramMap.subscribe(params => {
      console.log('DealerShipGroup', params);
      this.dealergrpid = params.get('dealerid');
    });
    this.getDealrships(this.dealergrpid);
    this.getDealershipData(this.dealergrpid);
  }

  getDealrships(grpid) {
    const bd = {
      //"dealerid":0
      "dealerid": 0,
      "expression": "dealer_dg_id =" + grpid
    };
    this.authService.dealershipList(bd).subscribe((data: any) => {
      console.log("Dealser Ship List :", data);
      if (data.status == 200) {
        this.GetDealershipsList = JSON.parse(data.response[0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B']);
      }
    });
  }

  DealersDetails() {
    this.router.navigate(['DealershipDetails']);
  }

  getDealershipData2(grpid) {
    const dgroupsObj = {
      "dealergroupid": grpid,
      "expression": ""
    };
    this.authService.GetDealershipGroups(dgroupsObj).subscribe((data1: any) => {
      console.log('Get groups Resp', grpid);
      if (data1.status == 200) {
        console.log('data of new', data1);
        this.getdgroups = JSON.parse(data1.response[0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B']);
        this.getdgroups = this.getdgroups[0];
        this.SpinnerService.hide();
        console.log('dgroups', this.getdgroups);
      }
    });
  }

  getDealershipData(grpid) {
    const bddata = {
      "dealergroupid": grpid,
      "expression": ""
    };
    this.authService.GetDealershipGroups(bddata).subscribe((data: any) => {
      console.log('Dealser Ship Details:', data);
      if (data.status == 200) {
        this.getdgroups = JSON.parse(data.response[0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B']);
        this.getdgroups = this.getdgroups[0];
        this.conts = this.getdgroups.DealershipGroupDetails.filter(element => {
          return element.dgd_type == 'C';
        });

        this.users = this.getdgroups.DealershipGroupDetails.filter(element => {
          return element.dgd_type == 'U';
        });

      }
    });
  }



  getStatesData() {
    const obj = { sg_id: 0 }
    this.authService.postmethod('States/get',obj).subscribe(
      resp => {
        console.log('Getstates', resp.response);
        this.getstatesresp = resp.response;

        const stid = this.getstatesresp.filter(element => {
          return element.sg_id == this.getdgroups.dg_state;
        });
        this.getstatesresp = stid[0];
        console.log('state id', stid);
      });
  }

}
