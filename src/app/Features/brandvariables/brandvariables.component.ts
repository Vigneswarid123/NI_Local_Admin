import { Component, Renderer2, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../../Core/_providers/api-service/api.service';
import { Router } from '@angular/router';
import { AlertifyService } from '../../Core/_providers/alert-service/alertify.service';
import { NgxSpinnerService } from "ngx-spinner";
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-brandvariables',
  templateUrl: './brandvariables.component.html',
  styleUrls: ['./brandvariables.component.scss']
})
export class BrandvariablesComponent implements OnInit {
  selectedvalues: any = [];
  FinalArray: any = [];

  Result;
  editvariable: any = []
  ComponentFinalArray: any = []
  Updatearray: any = [];
  // Addarray: any = []
  submitted = false;
  public brandvariables: any = [];
  public brandform: any = [];
  public editbrandvariables: any = [];
  public brandvariablesdata: any = [];
  public incentivedata: any = [];
  public BrandNames: any = [];
  selectedincentive: Array<any> = [];
  selectedIncentiveVariable: Array<any> = [];

  showIncentiveDiv: boolean = false;
  @ViewChild('menu', { static: false }) menu: ElementRef;
  selectedIncentiveid: any = [];
  selectedItem: any;


  dealershipid: number;
  brandid: number;

  SearchBrandVariables: FormGroup;
  hide: boolean = false;
  alphaSrch: string = '';
  atozFltr: boolean = false;
  BrandsInfo: any = [];
  alphaColumns: any = [""];

  addclick = false;
  showgrid = false;
  editclick = false;
  option = false;
  close = false;

  constructor(private fB: FormBuilder,
    private adminService: ApiService,
    private router: Router,
    private SpinnerService: NgxSpinnerService,
    private alertify: AlertifyService,
    private renderer: Renderer2) {


    this.SearchBrandVariables = this.fB.group({
      txtSearch: ""
    });

    this.brandvariables = this.fB.group({
      inc_variables: ['', Validators.required],
      inc_id: [''],
      dealeruser: ['', Validators.required],
      quantities: this.fB.array([]),


    });

    this.brandform = this.fB.group({
      id: ['', Validators.required]

    })
    this.editbrandvariables = this.fB.group({
      e_inc_variables: [''],
      e_inc_id: [''],
      e_dealeruser: [''],
      e_quantities: this.fB.array([]),


    });

    this.renderer.listen('window', 'click', (e: Event) => {

      if (this.menu == undefined) {
        this.showIncentiveDiv = false;
      }
      else
        this.showIncentiveDiv = false;
    });
    (<FormArray>this.brandvariables.get('quantities')).push(this.newQuantity());
    //(<FormArray>this.editbrandvariables.get('e_quantities')).push(this.enewQuantity());

  }

  ngOnInit(): void {
    this.showgrid = true;
    this.getBrands();
  }



  getdealerid(e) {
    this.dealershipid = e.target.value;
    console.log(this.dealershipid)
    this.optionDisplay();
  }

  optionDisplay() {
    console.log("option")
    if (this.selectedIncentiveid != '' && this.dealershipid != null) {
      this.option = true;
    }
    else {
      this.option = false;
    }
  }

  quantities(): FormArray {
    return this.brandvariables.get('quantities') as FormArray;
  }

  newQuantity(): FormGroup {
    return this.fB.group({
      values: ''
    });
  }
  AddInput() {
    console.log(this.brandvariables.get('quantities')['controls']);
    if (this.brandvariables.get('quantities')['controls']) {
      const qlen = this.brandvariables.get('quantities')['controls'].length;
      if (qlen == 0) {
        this.quantities().push(this.newQuantity());
      }
      if (qlen >= 1) {
        if (this.brandvariables.get('quantities')['controls'][qlen - 1].value.values === '') {
          this.alertify.error('Please enter the empty fields..!');
          return false;
        } else {
          this.quantities().push(this.newQuantity());
          console.log("end")
        }
      }
    }

  }

  remove(i: number) {
    this.quantities().removeAt(i);
  }

  getBrands() {
    const obj = {
      "brand_id": "0"
    }
    this.adminService.postmethod('brands/get', obj).subscribe(res => {
      console.log(res);
      if (res.status == 200) {
        this.BrandNames = res.response;
        console.log(this.BrandNames);



      }
    });
    this.SpinnerService.hide();
  }

  getincentives() {
    const obj = {
      "variableid": "0",
      "expression": ""
    }
    this.adminService.postmethod('incentivevariables/detailslist', obj).subscribe(res => {
      console.log(res)
      if (res.status == 200) {
        this.incentivedata = res.response;
        console.log(this.incentivedata)

      }
    })
  }
  getid(e) {
    console.log(e.target.value)
    this.brandid = e.target.value;
    console.log(this.brandid)
    //this.getbrandvariables()
    //  this.getDealerShip();
  }
  display() {
    console.log(this.brandid)
    if (this.brandid == 0 || this.brandid == undefined) {
      this.alertify.error("Please Select DealerShip")
    }

    else {
      console.log("display")
      this.getbrandvariables();
      this.submitted = false;
      console.log(this.submitted)

    }
  }
  getbrandvariables() {
    const obj = {

      "BrandId": this.brandid,
      "VariableId": "",
      "expression": ""

    }
    this.adminService.postmethod('brandvariables/get', obj).subscribe(res => {
      console.log(res)
      if (res.status == 200) {
        this.brandvariablesdata = res.response;
        console.log(this.brandvariablesdata)
        if (this.brandvariablesdata.length == 0) {
          this.Result = 'No Record Found!!!!';
          console.log(this.Result)
        }
        else {
          this.Result = ''
        }
      }
    })

  }
  filter(val: string): string[] {
    return this.incentivedata.filter(option =>
      option.Varbl_Name.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  OnChangeEvent(e) {
    console.log(e)
    console.log(e.code)
    this.selectedincentive = this.filter(e.target.value.toLowerCase())
    this.showIncentiveDiv = true;

    if (e.code == "Backspace") {
      this.showIncentiveDiv = false;

    }
  }

  selectItem(event: Event, item, index) {
    console.log(item)
    event.stopPropagation();
    if (this.selectedIncentiveid == "")
      this.selectedIncentiveid = [];
    if (item != '') {
      this.selectedIncentiveid = item.Varbl_Id;
      this.selectedIncentiveVariable = item.Varbl_Name;
      this.selectedItem = item;

      this.showIncentiveDiv = false;
    }
    //  console.log(this.selectedIncentiveid)
    //  console.log(this.selectedincentive)
    //  console.log(this.selectedIncentiveVariable)
    this.optionDisplay();

  }
  highlightRow(option) {
    this.selectedItem = option.Varbl_Name;
  }

  onSubmit() {
    console.log('form submission');
    this.submitted = true;
    if (this.brandvariables.invalid) {
      return;
    }
    if (this.brandvariables.get('quantities')['controls']) {
      const qlen = this.brandvariables.get('quantities')['controls'].length;
      if (qlen == 0) {
        this.alertify.error("Invalid Details")
      }
      if (qlen >= 1) {
        if (this.brandvariables.get('quantities')['controls'][qlen - 1].value.values === '') {
          this.alertify.error("Please Enter Value")
          // alert('Address 2' + qlen + ' is empty..!');
          return false;
        } else {
          console.log(this.brandvariables.value);

          this.ComponentFinalArray = [];
          console.log(this.brandvariables.value);

          if (this.brandvariables.value.quantities.length > 0) {

            for (var i = 0; i < this.brandvariables.value.quantities.length; i++) {
              this.ComponentFinalArray.push({
                'bv_invid': this.selectedIncentiveid,
                'bv_bid': this.dealershipid,
                'bv_value': this.brandvariables.value.quantities[i].values,
                'bv_status': 'Y'
              });
            }
            console.log(this.ComponentFinalArray)

            const obj = {
              "brandvariables": this.ComponentFinalArray
            }
            console.log(obj)
            this.adminService.postmethod('brandvariables', obj).subscribe(res => {
              console.log(res)
              if (res.status == 200) {
                this.alertify.success("Brand Variable Added Successfully")
                this.submitted = false;
                this.showGridPanel();
              }
              else {
                this.alertify.error("Invalid Details")
              }
            })
          }
        }
      }

    }
  }


  //*******************************************************************edit****************************************************************** */ 



  e_quantities(): FormArray {
    return this.editbrandvariables.get('e_quantities') as FormArray;
  }

  enewQuantity(): FormGroup {
    return this.fB.group({
      action: 'A',
      evalues: ''
    });
  }
  eAddInput() {
    console.log(this.editbrandvariables.get('e_quantities')['controls']);
    if (this.editbrandvariables.get('e_quantities')['controls']) {
      const qlen = this.editbrandvariables.get('e_quantities')['controls'].length;
      if (qlen == 0) {
        this.e_quantities().push(this.enewQuantity());
      }
      if (qlen >= 1) {
        if (this.editbrandvariables.get('e_quantities')['controls'][qlen - 1].value.evalues === '') {
          // alert('please enter value');
          this.alertify.error('Please enter the empty fields..!');
          // alert('Address 2' + qlen + ' is empty..!');
          return false;
        } else {
          this.e_quantities().push(this.enewQuantity());
          console.log("end")
        }
      }
    }

  }

  eremove(i: number) {
    let action = this.editbrandvariables.value.e_quantities[i].action = 'D';
    let BV_ID = this.editbrandvariables.value.e_quantities[i].BV_ID;
    let BV_Value = this.editbrandvariables.value.e_quantities[i].evalues;
    this.e_quantities().removeAt(i);
    const obj = {
      action: action,
      BV_Value: BV_Value,
      BV_ID: BV_ID
    };
    (<FormArray>this.editbrandvariables.get('e_quantities')).push(this.delete(obj));
  }

  delete(dt): FormGroup {
    return this.fB.group({
      action: [dt.action],
      evalues: [dt.BV_Value],
      BV_ID: [dt.BV_ID]
    });
  }

  updatebrandvariable() {

    console.log('form submission');
    this.submitted = true;
    if (this.editbrandvariables.invalid) {
      return;
    }
    if (this.editbrandvariables.get('e_quantities')['controls']) {
      const qlen = this.editbrandvariables.get('e_quantities')['controls'].length;
      if (qlen == 0) {
        this.alertify.error("Invalid Details")
      }
      if (qlen >= 1) {
        if (this.editbrandvariables.get('e_quantities')['controls'][qlen - 1].value.evalues === '') {
          this.alertify.error("Please Enter Value")
          // alert('Address 2' + qlen + ' is empty..!');
          return false;
        } else {
          console.log(this.editbrandvariables.value);

          this.ComponentFinalArray = [];
          this.Updatearray = [];
          console.log(this.editbrandvariables.value.e_quantities[0].action);
          console.log(this.editbrandvariables);
          if (this.editbrandvariables.value.e_quantities.length > 0) {
            for (var i = 0; i < this.editbrandvariables.value.e_quantities.length; i++) {
              if (this.editbrandvariables.value.e_quantities[i].evalues != null) {
                if (this.editbrandvariables.value.e_quantities[i].action == 'U') {
                  this.Updatearray.push({
                    'action': 'U',
                    'bvid': this.editbrandvariables.value.e_quantities[i].BV_ID,
                    'bv_invid': this.editvariable.BV_INVID,
                    'bv_bid': this.editvariable.BV_BID,
                    'bv_value': this.editbrandvariables.value.e_quantities[i].evalues,
                    'bv_status': 'Y'
                  });
                } else if (this.editbrandvariables.value.e_quantities[i].action == 'A') {
                  this.Updatearray.push({
                    'action': 'A',
                    'bv_invid': this.editvariable.BV_INVID,
                    'bv_bid': this.editvariable.BV_BID,
                    'bv_value': this.editbrandvariables.value.e_quantities[i].evalues,
                    'bv_status': 'Y'
                  })
                }
                else if (this.editbrandvariables.value.e_quantities[i].action == 'D') {
                  this.Updatearray.push({
                    'action': 'D',
                    'bvid': this.editbrandvariables.value.e_quantities[i].BV_ID
                  });
                }
              }
            }
          }

          const obj = {
            "brandvariables": this.Updatearray
          }
          console.log(obj)
          this.adminService.putmethod('brandvariables', obj).subscribe(res => {
            console.log(res)
            if (res.status == 200) {
              this.alertify.success("Brand Variable Updated Successfully")
              this.showGridPanel();

            }
            else {
              this.alertify.error("Invalid Details")
            }
          })
        }
      }
    }



  }




  //*************************************************************************Hide and Show ***************************************************** */
  showAddPanel() {
    this.addclick = true;
    this.showgrid = false;
    this.editclick = false;
    this.getincentives();
  }
  showGridPanel() {

    // location.reload();
    this.addaftercancel()
    this.editaftercancel()
    this.showgrid = true;
    this.addclick = false;
    this.editclick = false;
    this.getbrandvariables();
  }

  addaftercancel() {
    this.brandvariables.reset()
    for (var i = 0; i <= this.brandvariables.value.quantities.length; i++) {
      this.remove(i)
    }
    this.selectedIncentiveid = '';
    this.dealershipid = null;
    this.optionDisplay();
  }
  editaftercancel() {
    console.log("afteredit")
   
    for (var i = 0; i <= this.editbrandvariables.value.e_quantities.length; i++) {
      this.removeee(i)
    }
    this.editbrandvariables.reset();
 //   this.FinalArray.splice(0);
  //  this.Updatearray.splice(0)
    console.log(this.editvariable)
  }

  removeee(i: number) {
    this.e_quantities().removeAt(i);
  }

  editcall(val) {
    console.log(val);
    this.editclick = true;
    this.addclick = false;
    this.showgrid = false;
    this.editvariable = [];
    this.selectedvalues = [];
    //this.e_quantities().clear();
    this.editvariable = val;
    if (this.editvariable.BV_Value.length > 0) {
      let result = this.editvariable.BV_Value.split(',');
      this.selectedvalues.splice(0)
      for (let y in result) {
        this.selectedvalues.push({ bv_bid: this.editvariable.BV_BID, bv_invid: this.editvariable.BV_INVID, BV_Value: result[y].split('_')[0], BV_ID: result[y].split('_')[1], action: 'U' });
      }
      for (let T in this.selectedvalues) {
        (<FormArray>this.editbrandvariables.get('e_quantities')).push(this.value(this.selectedvalues[T]));
      }
    }

  }

  value(dt): FormGroup {
    return this.fB.group({
      action: 'U',
      evalues: [dt.BV_Value],
      BV_ID: [dt.BV_ID]
      // evalues: ''

    });
  };




  //***************************************************************************Filter***************************************************************** */
  onAlphaCatch(alphabet) {
    this.hide = true;
    this.atozFltr = true;
    this.alphaSrch = alphabet;

  }

  onSearch() {
    this.alphaSrch = this.SearchBrandVariables.controls['txtSearch'].value;
  }

  atoZClick() {
    if (!this.atozFltr)
      this.atozFltr = true;
    else
      this.atozFltr = false;
  }
}
