import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from '../../../Core/_providers/api-service/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdminServiceService } from '../../../Core/_providers/admin-service/admin-service.service';
import { AlertifyService } from '../../../Core/_providers/alert-service/alertify.service';


@Component({
  selector: 'app-edit-subscription-group',
  templateUrl: './edit-subscription-group.component.html',
  styleUrls: ['./edit-subscription-group.component.scss']
})
export class EditSubscriptionGroupComponent implements OnInit {
  public plans: any = [];
  subscriptionDetailsForm: FormGroup;
  submitted = false;
  sd_id: number;
  public globalresponse: any = [];
  public dealerGroups: any = [];
  public dealerShips: any = [];
  dealerGroupId: number;
  dealername: string;
  dealerShipId: number;
  dealershipname: string;
  plan: number;
  plandetails: string;
  subStatus: string;
  result;
  constructor(private fB: FormBuilder, private sanitizer: DomSanitizer, private router: Router, private adminService: AdminServiceService, private route: ActivatedRoute, private Api: ApiService,
    private SpinnerService: NgxSpinnerService, private alertify: AlertifyService) {
    this.route.queryParams.subscribe(params => {
      this.sd_id = params.sd_id;
      console.log(this.sd_id);
    });

    this.subscriptionDetailsForm = this.fB.group({
      dealergroup: [''],
      dealership: [''],
      subscriptionplan: ['', Validators.required],
      plandetails: ['', [Validators.required, Validators.maxLength(500)]],
      status: ['']
    });

  }

  ngOnInit(): void {
    this.getSubscriptionPlans();
    this.bindGrid();
    // this.getDealerNames();
  }
  getSubscriptionPlans() {
    this.SpinnerService.show();
    let obj = {
      "sp_id": "0",
      "expression": ""
    }
    this.Api.postmethod('subscriptionplans/get', obj).subscribe(res => {
      // console.log("d-users",res);
      if (res.status == 200) {
        this.plans = res.response;
        console.log(this.plans);
      }
    });
    this.SpinnerService.hide();

  }
  getDealerNames() {
    const dealergroupObj = {

      "dealergroupid": this.dealerGroupId,
      "expression": ""
    };

    this.Api.postmethod('dealershipgroups/get', dealergroupObj).subscribe(resp => {
      console.log(resp);
      if (resp.status == 200) {
        this.dealerGroups = JSON.parse(resp.response[0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B']);

        console.log(this.dealerGroups)
        this.dealername = this.dealerGroups[0].dg_name;
        console.log(this.dealername)
      }
    });
  }
  bindGrid() {
    this.SpinnerService.show();
    let obj = {
      "SdId": this.sd_id,
      "expression": ""
    }
    this.Api.postmethod('subscriptiondetails/get', obj).subscribe(res => {

      if (res.status == 200) {
        this.globalresponse = res.response;
        console.log(this.globalresponse)
        this.dealerGroupId = this.globalresponse[0].sd_dealergroup_id
        this.dealerShipId = this.globalresponse[0].sd_dealership_id
        this.plan = this.globalresponse[0].sd_plan_id
        this.plandetails = this.globalresponse[0].sd_plandetails
        if (this.globalresponse[0].sd_status == 'Y') {
          this.subStatus = 'Y';
        } else {
          this.subStatus = 'N';
        }
        console.log(this.dealerGroupId);
        console.log(this.dealerShipId);
        this.getDealerNames();
        this.getDealerShip();
      }
    });
    this.SpinnerService.hide();

  }
  getDealerShip() {
    const obj = {
      "dealerid": this.dealerShipId,
      "expression": "dealer_dg_id=" + this.dealerGroupId
    }
    this.Api.postmethod('dealerships/get', obj).subscribe(res => {
      console.log(res);
      if (res.status == 200) {
        this.dealerShips = JSON.parse(res.response[0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B']);
        console.log(this.dealerShips);
        this.dealershipname = this.dealerShips[0].dealer_name
        console.log(this.dealershipname)
      }
    });
    this.SpinnerService.hide();
  }

  OnSubmit() {
    this.submitted = true;
    if (this.subscriptionDetailsForm.invalid) {
      console.log("hii")
      return;
    }
    const obj = {
      SdId: this.sd_id,
      Sd_Dealergroup_Id: this.dealerGroupId,
      Sd_Dealership_Id: this.dealerShipId,
      Sd_Plan_Id: this.plan,
      Sd_Plandetails: this.subscriptionDetailsForm.value.plandetails,
      status: this.subscriptionDetailsForm.value.status
    };
    console.log('basheer', obj);
    this.adminService.Putmethod('subscriptionDetails', obj).subscribe(
      response => {
        console.log(response);
        this.result = response;
        if (this.result.status == 200) {
          this.alertify.success('SubscriptionDetails updated successfully');
          this.subscriptionDetailsForm.reset();
          this.subscriptionDetailsForm.markAsUntouched();
          this.subscriptionDetailsForm.markAsPristine();
          this.router.navigate(['subscriptionDetails']);
        }

      },
      (error) => {
        this.alertify.error(error);
      });
  }
  backgrid() {
    this.router.navigate(['subscriptionDetails']);

  }
}
