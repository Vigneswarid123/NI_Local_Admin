import { Component, Renderer2, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from '../../../Core/_providers/api-service/api.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { AdminServiceService } from '../../../Core/_providers/admin-service/admin-service.service';
import { AlertifyService } from '../../../Core/_providers/alert-service/alertify.service';

@Component({
  selector: 'app-subscription-group',
  templateUrl: './subscription-group.component.html',
  styleUrls: ['./subscription-group.component.scss']
})
export class SubscriptionGroupComponent implements OnInit {
  public globalresponse: any = [];
  // public global:any =[];
  public plans: any = [];
  public AllDealerShips: any = [];
  selectedDealership: Array<any> = [];
  selectedDealer: Array<any> = [];
  grid: boolean = true;
  addSub: boolean = false;
  result;

  Dealership: any = [];
  dealername: string;
  dealerid: number;
  dealerGroups: any = [];
  dealerShips: any = [];

  subscriptionDetailsForm: FormGroup;
  submitted = false;

  atozFltr: boolean = false;
  hide: boolean = false;
  alphaSrch: string = '';

  alphaColumns: any = ["dealershipname"];
  // alphaColumns:any=["Du_First_Name","Du_Last_Name"];
  SearchSubscriptionForm: FormGroup;

  showDealerShipDiv: boolean = false;
  @ViewChild('menu', { static: false }) menu: ElementRef;
  selectedItem: any;
  selectedDealerShip: any = [];
  selectedDealerid: any = [];

  constructor(private fB: FormBuilder, private sanitizer: DomSanitizer, private Api: ApiService, private router: Router, private renderer: Renderer2, private adminService: AdminServiceService,
    private SpinnerService: NgxSpinnerService, private alertify: AlertifyService) {
    //   this.getDealerShip();
    // this.getDealerNames();
    // this.getSubscriptionPlans();
    // this.getAllDealerShips();

    this.subscriptionDetailsForm = this.fB.group({
      dealership: ['', Validators.required],
      dealergroup: ['', Validators.required],
      subscriptionplan: ['', Validators.required],
      plandetails: ['', [Validators.required, Validators.maxLength(500)]],

    });

    this.renderer.listen('window', 'click', (e: Event) => {
      // console.log(this.menu.nativeElement.value);
      // if (e.target !== this.menu.nativeElement){
      if (this.menu == undefined) {
        this.showDealerShipDiv = false;
      }
      else
        this.showDealerShipDiv = false;
    });

    this.SearchSubscriptionForm = this.fB.group({
      txtSearch: ""
    });
  }



  ngOnInit(): void {
    this.grid = true;
    this.addSub = false;
    // this.bindGrid();
    this.getDealerNames();

  }
  getDealerNames() {
    const dealergroupObj = {

      "dealergroupid": "0",
      "expression": ""
    };

    this.Api.postmethod('dealershipgroups/get', dealergroupObj).subscribe(resp => {
      console.log(resp);
      if (resp.status == 200) {
        this.dealerGroups = JSON.parse(resp.response[0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B']);
        console.log(this.dealerGroups);
        this.getAllDealerShips();
      }
    });
  }
  getAllDealerShips() {
    const obj = {
      "DealerShipId": 0,
      "expression": ""
    }
    this.Api.postmethod('dealerships/alldealerships', obj).subscribe(res => {
      console.log(res);
      if (res.status == 200) {
        this.AllDealerShips = res.response;
        console.log(this.AllDealerShips);
        this.getSubscriptionPlans();
      }
    });
    this.SpinnerService.hide();
  }


  getDealerShip() {
    const obj = {
      "dealerid": 0,
      "expression": "dealer_dg_id=" + this.selectedDealerid
    }
    this.Api.postmethod('dealerships/get', obj).subscribe(res => {
      console.log(res);
      if (res.status == 200) {
        this.dealerShips = JSON.parse(res.response[0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B']);
        console.log(this.dealerShips);
      }
    });
    this.SpinnerService.hide();
  }



  bindGrid() {
    this.SpinnerService.show();
    let obj = {
      "SdId": "0",
      "expression": ""
    }
    this.Api.postmethod('subscriptiondetails/get', obj).subscribe(res => {

      if (res.status == 200) {
        this.globalresponse = res.response;
        console.log('glob', this.globalresponse);
        this.globalresponse.forEach(element => {
          this.dealerGroups.forEach(dta => {
            if (element.sd_dealergroup_id == dta.dg_id) {
              console.log('sd_dealergroup_id', dta.dg_name);
              element.dealer = dta.dg_name

            }
          })
        })


        this.globalresponse.forEach(element => {
          this.plans.forEach(data => {
            console.log("hii", element.sd_plan_id);
            if (element.sd_plan_id == data.sp_id) {
              console.log('ccc', data.sp_name);
              element.subplan = data.sp_name;
            }
          });
        });
        this.globalresponse.forEach(element => {
          this.AllDealerShips.forEach(data => {
            if (element.sd_dealership_id == data.dealer_id) {
              console.log('ccc', data.dealer_name);
              element.dealershipname = data.dealer_name;

            }
          });

        });
      }
    });
    this.SpinnerService.hide();

  }
  edit(val) {

    console.log(val.sd_id, 'ddd');
    this.router.navigate(['editsubscriptionDetails'], { queryParams: { sd_id: val.sd_id } });


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
        this.bindGrid();
      }
    });
    this.SpinnerService.hide();

  }


  AddSubDet() {
    this.grid = false;
    this.addSub = true;
    console.log(this.selectedDealerShip)
  }


  showGridPanel() {
    this.grid = true;
    this.addSub = false;
    this.bindGrid();
  }

  filter(val: string): string[] {
    return this.dealerGroups.filter(option =>
      option.dg_name.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  OnChangeEvent(e) {
    console.log(e)
    console.log(e.code)
    this.selectedDealerShip = this.filter(e.target.value.toLowerCase())
    this.showDealerShipDiv = true;

    if (e.code == "Backspace") {
      this.showDealerShipDiv = false;

    }
  }

  selectItem(event: Event, item, index) {
    console.log(item);
    event.stopPropagation();
    if (this.selectedDealerid == "")
      this.selectedDealerid = [];
    if (item != '') {
      this.selectedDealerid = item.dg_id;
      this.selectedDealer = item.dg_name;
      this.selectedItem = item;

      this.showDealerShipDiv = false;
    }
    console.log(this.selectedDealerid)
    console.log(this.selectedDealerShip)
    console.log(this.selectedDealer)
    this.getDealerShip();

  }
  highlightRow(option) {
    this.selectedItem = option.dg_name;
  }

  OnSubmit() {
    this.submitted = true;
    if (this.subscriptionDetailsForm.invalid) {
      console.log("hii")
      return;
    }
    console.log(this.subscriptionDetailsForm.value)
    const obj = {
      Sd_Dealergroup_Id: this.selectedDealerid,
      Sd_Dealership_Id: this.subscriptionDetailsForm.value.dealership,
      Sd_Plan_Id: this.subscriptionDetailsForm.value.subscriptionplan,
      Sd_Plandetails: this.subscriptionDetailsForm.value.plandetails,
      status: "Y"
    }
    this.adminService.postmethod('subscriptionDetails', obj).subscribe(
      response => {
        console.log(response);
        this.result = response
        if (this.result.status == 200) {
          this.alertify.success('SubscriptionDetails Added successfully');
          this.subscriptionDetailsForm.reset();
          this.subscriptionDetailsForm.markAsUntouched();
          this.subscriptionDetailsForm.markAsPristine();
          this.grid = true;
          this.addSub = false;
          this.bindGrid();
        }

      },
      (error) => {
        this.alertify.error(error);
      });
  }


  onAlphaCatch(alphabet) {
    this.hide = true;
    this.atozFltr = true;
    this.alphaSrch = alphabet;
    console.log("Alphabet" + this.alphaSrch);
  }

  onSearch() {
    // console.log(this.SearchSubscriptionForm.controls['txtSearch'].value)
    this.alphaSrch = this.SearchSubscriptionForm.controls['txtSearch'].value;
  }

  atoZClick() {
    if (!this.atozFltr)
      this.atozFltr = true;
    else
      this.atozFltr = false;
  }

}
