import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from "../../Core/_providers/api-service/api.service";
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { AlertifyService } from '../../Core/_providers/alert-service/alertify.service';
import { environment } from 'src/environments/environment';
import { ModalDialogService } from 'src/app/Shared/modal-dialog/modal-dialog.service';
import { promise } from 'protractor';
import { Router, NavigationEnd, ActivatedRouteSnapshot } from '@angular/router';
import { Console } from 'console';
import { NgxSpinnerService } from 'ngx-spinner';

declare var $: any;

@Component({
  selector: 'app-incentive-master',
  templateUrl: './incentive-master.component.html',
  styleUrls: ['./incentive-master.component.scss'],
  providers: [AngularMultiSelectModule],
})
export class IncentiveMasterComponent implements OnInit {
  incentiveMasterForm: FormGroup;
  brandform: FormGroup;
  OemBrands: any[];
  selectedBrandsList: any = [];
  selectedBrandLogo: any = [];
  serachBrands: any = [];
  selectedbrandid: any = [];
  brandspopup: boolean = false;
  showBrand: boolean = false;
  selectedBrands: string[];
  showBrandAutofill: boolean;
  selectedItem: any;
  incentivetypes: any = [];
  regionsList: any = [];
  dealershipStores: any = [];
  dvStores: boolean = false;
  submitted = false;
  showIncentiveView: Boolean = false;
  showIncentiveDetails: boolean = false;
  showTermsandConditions: boolean = false;
  selectedchkList: any = [];
  VariablesData: any = [];
  LineItemsData: any = [];
  showregionadd: boolean = false;
  secondregionsList: any = [];
  TermsAndConditions: any = [];
  ShowAddIncentive: boolean = false;
  incentiveid: number = 0;
  incentiveVaraibles: any = [];
  finalObjData: any = {
    dealerregions: '',
  };
  incentivesData: any = [];
  showIncentiveLineItems: boolean = true;
  incentivesArray: any = [];
  hide: boolean;
  atozFltr: boolean;
  alphaSrch: string = '';
  tempincentives: any = [];
  SearchIncentiveForm: FormGroup;
  alphaColumns: any = ['MI_NAME'];
  variablesList: any[];
  showgrid: boolean = false;
  dropdownSettings = {};
  brandSettings={};
  selectedRegionItems = [];
  selectedSearchBrandItems=[];
  dropdownList = [];
  _glbBrandId: string = "";
  FinalArray: any = [];
  tacdata: any = [];
  dealerships: any = [];
  _glbIncentiveId: number = 0;
  showTermDiv: boolean = false;
  showLineItemsLink: boolean = false;
  @ViewChild('brandmenu', { static: false }) brandmenu: ElementRef;
  lineData: any = [];
  viewCancel: boolean = false;
  showTermDiv1: boolean = true;
  isEdit: boolean = true;
  detailViewType: string = '';
  _glbLineHdrId: number = 0;

  status: string;
  visible: boolean;
  data: boolean;
  incentiveacceptdata: any = [];

  ImagPath: any = `${environment.apiUrl}` + '/resources/images';
  editTerms: string;
  showLineItemsLink1: boolean;
  isPublish: boolean;
  showBrandImageDiv:boolean=true;
  FromDate: string;
  ToDate: string;
  srchBrids:any=[];
  _glbLnhdrSeqnId: number = 0;
  navigationSubscription;  
  showSearchDiv:boolean=true;
  i:number = 0;
  glbIncentiveName: any;
  glbIncentiveType: any;
  selectedFile:any=null;
  fileName: any;
  AddView: boolean=false;EditView: boolean;
  lineItemsInfo:any=[];
;
  constructor(
    private ApiService: ApiService,
    private fB: FormBuilder,
    private datepipe: DatePipe,
    private cdRef: ChangeDetectorRef,
    private renderer: Renderer2,
    private alertify: AlertifyService,
    private modalSrvc:ModalDialogService,
    private router: Router,
    private SpinnerService: NgxSpinnerService,
  ) {
   
    this.renderer.listen('window', 'click', (e: Event) => {
      if (this.brandmenu == undefined) {
        this.showBrandAutofill = false;
      } else this.showBrandAutofill = false;
    });

    this.incentiveMasterForm = this.fB.group({
      incentivename: ['', [Validators.required, Validators.maxLength(100)]],
      incentivetype: ['', Validators.required],
      region: [''],
      datefrom: ['', Validators.required],
      dateto: ['', Validators.required],
      file:['']
    });
    this.brandform = this.fB.group({
      txtbrand: [''],
    });
    this.SearchIncentiveForm = this.fB.group({
      txtsearch: '',
      ddldate :'C',
      brandsrch:[[]]
    });

    this.showTermsandConditions = false;
    this.ShowAddIncentive = false;

    this.showIncentiveView = false;
    this.showIncentiveLineItems = false;
    this.showgrid = true;
    // this.getLineItemsDetails();
  }
  ngAfterViewChecked() {
      this.cdRef.detectChanges();
  }

  ngOnInit(): void {  
    // this.router.events.subscribe(evt => {
    //   if(this.i == 0){
    //       this.showSearchDiv = true;
    //       this.ShowAddIncentive = false;
    //       this.showTermsandConditions = false;
    //       this.showgrid = true;
    //       this.showIncentiveLineItems = false;
    //       this.showIncentiveView = false;
    //   }
    //   this.i++;
    // });

    this.router.routeReuseStrategy.shouldReuseRoute = function(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot) {
      if(future.url.toString() === 'incentiveMaster' && curr.url.toString() === future.url.toString()){
       return false;
      }
      return (future.routeConfig === curr.routeConfig);    
    };

    this.GetBrandsList();
    this.SpinnerService.show();
    this.getIncentivesList();
    setTimeout(() => {
      this.SpinnerService.hide();
    }, 1000);

    this.getIncentiveTypes();
    this.getRegions();

    this.selectedRegionItems = [];
    this.dropdownSettings = {
      singleSelection: false,
      text: 'Select',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: 'myclass custom-class',
      primaryKey:"id",
      badgeShowLimit:1
      //lazyLoading : true
    };
    this.selectedSearchBrandItems=[];
    this.brandSettings={
      singleSelection: false,
      text: 'Select Brand',
    
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: 'myclass custom-class',
      primaryKey:"id",
      badgeShowLimit:1
    }
    this.lineItemsInfo.push({incentiveId:"", incentiveName:"", incentiveType:"", lineHdrId:"", lineHdrSeqnId:"", brandId:"", viewType:""});
  }
  GetBrandsList() {
    this.OemBrands = [];
    const obj = { brand_id: 0 };
    this.ApiService.postmethod('oembrands/get', obj).subscribe(
      (response: any) => {
        if (response.message == 'success') {
          this.OemBrands = response.response;
          this.serachBrands = response.response;

          let arr = [];
          this.OemBrands.forEach((element) => {
            arr.length === 0
              ? (arr = [{ id: element.brand_chrome_id, itemName: element.brand_name }])
              : arr.push({
                  id: element.brand_chrome_id,
                  itemName: element.brand_name,
                });
          });
          this.serachBrands = arr;


          if (this.selectedbrandid != '') {
            if (this.selectedbrandid.length > 0) {
              for (let i = 0; i < this.selectedbrandid.length; i++) {
                //this.Brands.splice(this.selectedbrandid[i],1);
                this.OemBrands = this.OemBrands.filter(
                  (item) => item.brand_chrome_id != this.selectedbrandid[i]
                );
              }
            }
          }
          //console.log(this.Brands)
        }
      }
    );
  }
  regionValues(): FormArray {
    return this.incentiveMasterForm.get('regionValues') as FormArray;
  }
  addBrand() {
    this.showBrand = true;
    this.brandform.controls['txtbrand'].setValue('');
  }
  filter(val: string): string[] {
    return this.OemBrands.filter(
      (option) =>
        option.brand_name.toLowerCase().indexOf(val.toLowerCase()) === 0
    );
  }
  OnChangeEvent(e) {
    this.selectedBrands = this.filter(e.target.value.toLowerCase());
    this.showBrandAutofill = true;
  }
  selectItem(event: Event, item, index) {
    event.stopPropagation();
    if (this.selectedbrandid == '') this.selectedbrandid = [];
    if (item != '') {
      this.selectedbrandid.push(item.brand_chrome_id);
      this.OemBrands = this.OemBrands.filter(
        (x) => x.brand_chrome_id != item.brand_chrome_id
      );
      this.selectedItem = item;
      this.showBrandAutofill = false;
      this.selectedBrandLogo.push(item.brand_logo);
      this.selectedBrandsList.push({
        brand_id: item.brand_chrome_id,
        brand_name: item.brand_name,
        brand_logo: item.brand_logo,
      });
      this.brandform.controls['txtbrand'].setValue('');
      // $(".modal-backdrop").remove();
    }
  }
  removeBrandTag(item, index, id) {
    this.OemBrands.push({ brand_chrome_id: id, brand_name: item });

    this.selectedBrandsList.splice(index, 1);
    this.selectedbrandid.splice(index, 1);
    this.selectedBrandLogo.splice(index, 1);
  }
  highlightRow(option) {
    this.selectedItem = option.brand_name;
  }
  closeModel() {
    $('.modal-backdrop').remove();
    $('body').removeClass('modal-open');
    this.showBrand = false;
    this.brandspopup = false;

    //this.dvStores = true;
    // this.incentiveForm.controls["region"].setValue("0");
    // this.getDealershipListByBrand();
  }

  getIncentiveTypes() {
    const obj = { incentivetype_id: 0, expression: '' };
    this.ApiService.postmethod('incentivetypes/get', obj).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.incentivetypes = res.response;
          this.incentivetypes = this.incentivetypes.filter((x:any)=> x.incentivetype_status=='Y');
        }
      }
    );
  }

  getRegions() {
    const obj = {
      region_id: 0,
    };
    this.ApiService.postmethod('regions/get', obj).subscribe((res: any) => {
      if (res.status == 200) {
        if (this.regionsList.length == 0) this.regionsList = res.response;
        this.secondregionsList = res.response;
        let arr = [];
        this.regionsList.forEach((element) => {
          arr.length === 0
            ? (arr = [{ id: element.region_iD, itemName: element.region_name }])
            : arr.push({
                id: element.region_iD,
                itemName: element.region_name,
              });
        });
        this.dropdownList = arr;
        console.log(this.dropdownList);
      }
    });
  }
//  Brand Related Functions
  onBrandItemSelect(item: any) {
    // console.log(item);
    // console.log(this.selectedSearchBrandItems);
    this.getIncentivesList();
  }
  OnBrandItemDeSelect(item: any) {
    // console.log(item);
    // console.log(this.selectedSearchBrandItems);
    this.getIncentivesList();
  }
  onBrandSelectAll(items: any) {
    // console.log(items);
    this.getIncentivesList();
  }
  onBrandDeSelectAll(items: any) {
    // console.log(items);
    this.getIncentivesList();
  }



  onItemSelect(item: any) {
   // this.showDealerStores(item);
    console.log(item);
    console.log(this.selectedRegionItems);
  }
  OnItemDeSelect(item: any) {
   // this.showDealerStores(item);
    console.log(item);
    console.log(this.selectedRegionItems);
  }
  onSelectAll(items: any) {
   // this.showDealerStores(items);
    console.log(items);
  }
  onDeSelectAll(items: any) {
   // this.showDealerStores(items);
    console.log(items);
  }
  regionids = [];
  // showDealerStores(data) {
  //   // return Promise.resolve(
  //   //   (()=>{
  //       if (this.selectedbrandid.length == 0) {
  //         this.alertify.success('Please select Brand');
  //         this.incentiveMasterForm.controls['region'].setValue('');
  //         return false;
  //       }
    
  //       if (data.length == 0)
  //         this.regionids.push(
  //           this.incentiveMasterForm.controls['region'].value[0].id);
  //       else {
  //         if (this.incentiveid == 0) {
  //           this.regionids = [];
  //           for (var i = 0;i < this.incentiveMasterForm.controls['region'].value.length;i++)
  //             this.regionids.push(this.incentiveMasterForm.controls['region'].value[i].id);
  //         }
  //       }
    
  //       if (this.regionids.length != 0) {
  //         const obj = {
  //           Brand: this.selectedbrandid,
  //           Region: this.regionids,
  //           dealergroupid:0
  //         };
  //         this.ApiService.postmethod('incentivemaster/getdealerstores', obj).subscribe((response: any) => {
  //           console.log(response);
  //           if (response.status == 200) {
  //             this.dealershipStores = response.response;
  //             if (this.dealershipStores.length != 0) this.dvStores = true;
  //             if(this.incentiveid !=0)
  //               this.getDealerShipsByIncentive(this.incentiveid)
  //           }
  //         });
  //       } else {
  //         this.selectedchkList = [];
  //         this.dvStores = false;
  //       }
  //   //   })
  //   // )
    
  // }

  onAllCheckboxChangeEvent(e) {
    const checked = e.target.checked;
    this.dealershipStores.forEach((item) => {
      item.selected = checked;
      this.selectedchkList.push(item.dealer_id);
    });
  }

  onCheckboxChange(e,i) {
    if(e.srcElement.checked){
    if (e.target.value)
      //console.log(e.target.value)
      this.selectedchkList.push(e.target.value);
    }
    else{
      this.selectedchkList.splice((i-1),1)
    }
  }

  OnSubmit() {
    this.submitted = true;
    if (this.incentiveMasterForm.invalid) {
      return;
    }
    if(this.selectedbrandid.length == 0)
    return false;
        var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    let todaydate = mm + '/' + dd + '/' + yyyy;
    if(this.incentiveMasterForm.value.dateto < this.incentiveMasterForm.value.datefrom ){
     this.alertify.success('End Date should more than Start Date')
     return false
    }
    if(this.selectedRegionItems.length!=0){
      for(var i=0;i<this.selectedRegionItems.length;i++)
        this.regionids.push(this.selectedRegionItems[i].id);
    }
    // if(this.selectedRegionItems.length == 0){
    //   this.regionids=[];
    //   for(var i=0;i<this.dropdownList.length;i++)
    //   this.regionids.push(this.dropdownList[i].id);
    // }
    let userId = localStorage.getItem('dealeruserid');
    const formdata:any = new FormData();
    console.log(userId);
    if (this.incentiveid == 0) {
      const obj = {
        inmname: this.incentiveMasterForm.value.incentivename,
        inmtypeid: this.incentiveMasterForm.value.incentivetype,
        inmstatus: 'Y',
        datefrom: this.datepipe.transform(this.incentiveMasterForm.value.datefrom, 'MM/dd/yyyy'),
        dateto: this.datepipe.transform(this.incentiveMasterForm.value.dateto,'MM/dd/yyyy'),
        regionValues: this.regionids.join(','),
        brandids: this.selectedbrandid.join(','),
        // dealer_id : 0
        dealerIds: this.selectedchkList.join(','),
        createdUser:userId,
        updatedUser:0,
        incentiveCreatedBy:'O'
      };
      if (this.selectedFile && this.incentiveid == 0){
        formdata.append('data', JSON.stringify(obj));
       
          formdata.append('file', this.fileName);
        }
        else{
          formdata.append('data', JSON.stringify(obj));
        }
      console.log(obj);
      this.ApiService.postmethod('incentivelist', formdata).subscribe((res: any) => {
        if (res.status == 200) {
          this.alertify.success('Incentive Primary Details Added Successfully');
          this.incentiveid = res.response.inmid;
          this.ShowAddIncentive = false;
          this.showTermsandConditions = false;
          this.showgrid = false;
          this.showIncentiveLineItems = false;
          this.showIncentiveView = false;
          if(this.datepipe.transform(this.incentiveMasterForm.value.datefrom,'MM/dd/yyyy') > todaydate )
            this.SearchIncentiveForm.controls["ddldate"].setValue("F");
          else 
          this.SearchIncentiveForm.controls["ddldate"].setValue("C");  
          //this.getIncentivesList();
          this.viewIncentiveData(this.incentiveid, this.selectedbrandid, 'E');
        }
        else if(res.error=="IncentiveMaster Already Exists."){
          this.alertify.error("Incentive Master Already Exists");
          return false;
        }
      });
    } else {
      let regionVals=[];
      if(this.selectedRegionItems.length!=0){
       
        for(var i=0;i<this.selectedRegionItems.length;i++)
        regionVals.push(this.selectedRegionItems[i].id);
      }
      
      const obj = {
        inmid: this.incentiveid,
        inmname: this.incentiveMasterForm.value.incentivename,
        inmtypeid: this.incentiveMasterForm.value.incentivetype,
        inmstatus: 'Y',
        datefrom: this.datepipe.transform(this.incentiveMasterForm.value.datefrom,'MM/dd/yyyy'),
        dateto: this.datepipe.transform(this.incentiveMasterForm.value.dateto,'MM/dd/yyyy'),
        regionValues: regionVals.join(','),
        brandids: this.selectedbrandid.join(','),
        // dealer_id : 0
        dealerIds: this.selectedchkList.join(','),
        createdUser:0,
        updatedUser:userId,
        filename:'',
        incentiveCreatedBy:'O'
      };
      console.log(obj)
      formdata.append('data', JSON.stringify(obj));
      if(this.fileName !='')
        formdata.append('file', this.fileName);
      else   
          formdata.append('file', this.selectedFile);
      this.ApiService.putmethod('incentivelist', formdata).subscribe((res: any) => {
        if (res.status == 200) {
          this.alertify.success('Incentive Primary Details Updated Successfully');
          //this.incentiveid = 0;
          this.ShowAddIncentive = false;
          this.showTermsandConditions = false;
          this.showgrid = true;
          this.showIncentiveLineItems = false;
          this.showIncentiveView = false;
         // this.getIncentivesList();
         this.viewIncentiveData(this.incentiveid, this.selectedbrandid, 'E');
        }
      });
    }
  }

  getIncentiveTermsAndConditions() {
    this.editTerms = '';
    const obj = {
      id: 0,
    };
    this.ApiService.postmethod('incentivetermsandconditions/get', obj).subscribe(
      (response: any) => {
        console.log(response);
        if (response.status == 200) {
          this.TermsAndConditions = response.response;
          this.TermsAndConditions = this.TermsAndConditions.filter((x:any)=> x.MIT_STATUS=='Y');
          this.ShowAddIncentive = false;
          this.showTermsandConditions = true;
          this.showgrid = false;
          this.showIncentiveLineItems = false;
          this.showIncentiveView = false;

          // this.editTerms = 'Edit';
          
        }
      }
    );
  }
  incentiveRegions: any = [];
  getIncentiveVariablesData(): Promise<any> {
    return Promise.resolve(
      (() => {
        const obj = { IncentiveId: this.incentiveid, expression: '' };
        this.ApiService.postmethod(
          'incentivemaster/getvariabledata',
          obj
        ).subscribe((res: any) => {
          if (res.status == 200) {
            this.incentiveVaraibles = res.response;
            for(var i=0;i<this.incentiveVaraibles.length;i++){

            }
            this.incentiveRegions = [];
            this.incentiveVaraibles.forEach((element) => {
              if (element.regioname != '--')
                this.incentiveRegions.push( ' '+element.regioname);
              else{
                if(element.VariableName == " From")
                 this.FromDate="From "+element.INV_DATA;
                 if(element.VariableName == " To")
                 this.ToDate= element.INV_DATA;
              }  
            });
          }
        });
        return;
      })()
    );
  }
  TypeOfView: string = '';
  getDealerShipsByIncentive(inid):Promise<any> {
    return Promise.resolve(
      (()=>{
      this.selectedchkList = [];
      //this.dealershipStores = [];
      const obj = { IncentiveId: inid };
      this.ApiService.postmethod(
        'incentiveaccept/dealershipsbyincentive',
        obj
      ).subscribe((response: any) => {
        if (response.status == 200) {
          this.dealerships = response.response;
          //this.showDealerStores(this.regionids);
          // if (this.dealerships.length != 0) {
          //   this.dvStores = true;
          //   for (var i = 0; i < this.dealerships.length; i++) {
          //     this.selectedchkList.push(this.dealerships[i].IND_Dealer_ID);
  
          //     let checked = false;
          //     let j=0;
          //     this.dealershipStores.forEach((item: any) => {
            
          //       if (item.dealer_id == this.selectedchkList[i]) {
          //         this.dealershipStores[j].checked = 'Y';
          //         item.value = item.dealer_id;
          //         item.selected = checked;
          //       }
          //       j++;
          //     });
          //   }
          // }
        }
      });
      return;

    })()
    );
   
  }

  viewIncentiveData(id, _brandId, TypeData) {
    this.SpinnerService.show();
    this.showTermDiv = true;
    this.showSearchDiv=false;
    if (TypeData == 'V') {
      this.TypeOfView = 'P';
      this.showLineItemsLink = false;
      this.isPublish = false;
      this.showTermDiv = false;
      //this.data=true;
     
    }
    if (TypeData == 'E') {
      this.TypeOfView = 'E';
      this.showLineItemsLink = true;
      this.isPublish = true;
      this.data=false;
    }

    this._glbBrandId = _brandId;
    this._glbIncentiveId = id;
    this.showIncentiveView = true;
    this.showgrid = false;
    this.selectedbrandid = [];
    this.GetBrandsList();
    // this.showIncentive = true;
    
    this.viewCancel = true;
    this.incentiveid = id;
    this.ViewIncentives();
    this.getIncentiveVariablesData();
    this.getIncentiveTermaAndConditionsData(id);
    this.getDealerShipsByIncentive(id);
    this.getIncentiveLineItemsData(id);
    //this.getIncentiveLineItemsData();

    if(TypeData == 'V')
    {
      this.incentiveaccept();
    }
  }

  ViewIncentives() {

   
    let param = this.SearchIncentiveForm.controls['ddldate'].value;
    const obj = { Id: this.incentiveid, expression: '','type':param,  "BrandIds":''};
    this.ApiService.postmethod('incentivelist/get', obj).subscribe(
      (response: any) => {
        if (response.status == 200) {
          this.SpinnerService.hide();
          this.incentivesData = response.response[0];
          this._glbBrandId=response.response[0].brandids;
          this.glbIncentiveName=this.incentivesData.MI_NAME;
          this.glbIncentiveType=this.incentivesData.typename;
        
          this.lineItemsInfo["incentiveId"]=response.response[0].MI_ID;
          this.lineItemsInfo["incentiveName"]=response.response[0].MI_NAME;
          this.lineItemsInfo["incentiveType"]=response.response[0].typename;
          this.lineItemsInfo["brandId"]=response.response[0].brandids;

        }
      }
    );
  }

  incentiveaccept() {
    this.incentiveacceptdata=[];
    const obj = {
      "IND_MI_ID":this.incentiveid
  }
    this.ApiService.postmethod('incentiveaccept/statusbyid', obj).subscribe((response: any) => {
      if (response.status == 200) {
        if(response.response.length !=0)
        this.data=true;
           this.incentiveacceptdata = response.response;
       // console.log(this.incentiveacceptdata)
      }
    });
  }

  pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
  public presentDate: string = this.datepipe.transform(new Date(),'yyyy-MM-dd') ;
  public date1: string='';
  public date2: string='';
 
  display = [];
  changeFirstInput(e) {
    this.date1 = e.target.value;
    this.display.push(this.date1);
  }
 
  changeSecondInput(e) {
    this.date2 = e.target.value;
    if(this.date2 < this.date1 || this.date2 < this.presentDate){
      this.alertify.error('End Date Must be Present or Future date');
      this.incentiveMasterForm.controls["dateto"].setValue('');
      return false
    }
    this.display.push(this.date2);
    console.log('displayArray', this.display);
  }

  getLineItemsDetails() {
    const obj = {
      variableid: 0,
      expression: this.lineItemsInfo["brandId"],
    };
    //this.showIncentiveLineItems = true;
    this.ApiService.postmethod('incentivevariables/detailslist', obj).subscribe(
      (res: any) => {
        if (res.status === 200) {
          this.variablesList = res.response;
          this.ShowAddIncentive = false;
          this.showTermsandConditions = false;
          this.showgrid = false;
          this.showIncentiveLineItems = true;
          this.showIncentiveView = false;
        }
      }
    );
  }
  getIncentiveLineItemsData(incentiveid) {
    const obj = { IncentiveId: incentiveid, expression: '' };
    this.ApiService.postmethod('incentivemaster/getlineitems', obj).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.lineData = res.response;
        }
      }
    );
  }
  showIncentiveAddPanel() {
    this.EditView=false;
    this.AddView=true;
    this.showBrandImageDiv=true;
    this.showSearchDiv=false;
    this.incentiveid = 0;
    this.submitted = false;
    this.ShowAddIncentive = true;

    this.showTermsandConditions = false;
    this.showgrid = false;
    this.showIncentiveLineItems = false;
    this.showIncentiveView = false;
    //this.selectedbrandid = [];
    this.dvStores = false;
    this.selectedchkList = [];
    this.selectedbrandid = [];
    this.selectedBrandsList = [];
    this.selectedBrandLogo = [];
    this.selectedBrands = [];
    this.selectedFile='';
    this.fileName='';
    this.getRegions();
    this.GetBrandsList();
    this.incentiveMasterForm = this.fB.group({
      incentivename: ['', Validators.required],
      incentivetype: ['', Validators.required],
      region: [''],
      datefrom: ['', Validators.required],
      dateto: ['', Validators.required],
      file:['']
    });
    //this.incentiveMasterForm.controls['region'].setValue("");
    this.regionids = [];

    this.selectedRegionItems = [];
    this.dropdownSettings = {
      singleSelection: false,
      text: 'Select',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: 'myclass custom-class',
      badgeShowLimit:1
    };
  }
  getIncentivesList() {
    //this.alphaSrch="";
    this.showSearchDiv=true;
    this.incentivesArray = [];
    this.tempincentives=[];
    this.incentiveid=0;
    this.srchBrids=[];
    if(this.selectedSearchBrandItems.length!=0){
      for(var i=0;i<this.selectedSearchBrandItems.length;i++){
        this.srchBrids.push(this.selectedSearchBrandItems[i].id)
      }
    }
    let param = this.SearchIncentiveForm.controls['ddldate'].value;
    const obj = { Id: this.incentiveid, expression: '',type: param, "BrandIds": this.srchBrids.join(',') };
    this.ApiService.postmethod('incentivelist/get', obj).subscribe(
      (response: any) => {
        if (response.status == 200) {
          this.incentivesArray = response.response;

          this.tempincentives = this.incentivesArray;
          if(this.incentivesArray.length == 0){
           this.onAlphaCatch("");
           this.atozFltr=false;
          }
          // this.showIncentiveView = false;
          // this.showIncentiveLineItems = false;
          // this.showTermsandConditions = false;
          // this.showgrid = true;
          //console.log(this.tempincentives);
        }
      }
    );
  }
  SortGrid(){
   let field="MI_TS";
  this.tempincentives.sort((a: any, b: any) => {
    if (a[field] < b[field]) {
        return -1;
    } else if (a[field] > b[field]) {
        return -1;
    } else {
        return 0;
    }
});
this.tempincentives = this.tempincentives;
  }
  getDimensionsByFind(id) {
    return this.OemBrands.find((x) => x.brand_chrome_id == id);
  }

  getIncentiveTermaAndConditionsData(id):Promise<any> {
    return Promise.resolve((()=>{
      this.tacdata = [];
      const obj = { IncentiveId: id, expression: '' };
      this.ApiService.postmethod(
        'termsandconditions/basedonincentive',
        obj
      ).subscribe((response: any) => {
        //console.log(response);
        if (response.status == 200)
          if (response.response.length != 0) this.tacdata = response.response;
      }); 
      return;
    })()
    );
   
  }

  cancelEdit() {
    this.showIncentiveView = false;
    this.showgrid = true;
    this.showSearchDiv=true;
    this.getIncentivesList();
  }

  Publish() {
    let userId = localStorage.getItem('dealeruserid');
    const obj = { inm_id: this.incentiveid, dealer_id: userId,'incentivetype':'O' };
    this.ApiService.putmethod('incentiveaccept', obj).subscribe(
      (response: any) => {
        console.log(response);
        if (response.status == 200) {
          this.incentiveid = 0;
          this.showIncentiveView = false;
          this.showIncentiveLineItems = false;
          this.showTermsandConditions = false;
          this.showgrid = true;
          this.showSearchDiv=true;
          this.getIncentivesList();
          this.closeModal('Confrim-modal');
        }
      }
    );
  }

  BackToEdit() {
    this.showIncentiveLineItems = false;
    this.showIncentiveView = true;
    this.showIncentiveLineItems = false;
    this.showTermsandConditions = false;
  }
  CancelSAveClick() {
  
   if(this.incentiveid==0){​​​​​​​​
    this.incentiveid = 0;
    this.showgrid = true;
    this.ShowAddIncentive = false;
    this.showSearchDiv=true;
   }
    else if(this.incentiveid !=0){
    this.showIncentiveView=true;
    this.ShowAddIncentive=false;
    
    }
  }
  onAlphaCatch(alphabet) {
    this.hide = true;
    this.atozFltr = true;
    this.alphaSrch = alphabet;
    this.incentivesArray = this.tempincentives;
    console.log(this.alphaSrch);
  }

  onSearch() {
    this.alphaSrch = this.SearchIncentiveForm.controls['txtsearch'].value;
    this.onAlphaCatch(this.alphaSrch);
    this.atozFltr=false;
    console.log(this.alphaSrch);
    this.incentivesArray = this.tempincentives;
  }

  atoZClick() {
    if (!this.atozFltr) this.atozFltr = true;
    else this.atozFltr = false;
  }
  editIncentive() {
    //this.incentiveid = id;
    //this.addclick = true;
    this.EditView=false;
    this.AddView=false;
    this.showBrandImageDiv=false;
    this.ShowAddIncentive = true;
    this.showIncentiveView = false;
    this.showSearchDiv=false;
    this.submitted=false;
    
    this.showgrid = false;
    this.VariablesData = [];
    this.LineItemsData = [];
    this.getRegions();
    this.dropdownSettings = {
      singleSelection: false,
      text: 'Select Region(s)',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: 'myclass custom-class',
      badgeShowLimit:1
    };

    this.selectedBrandsList = [];
    this.selectedBrandLogo = [];
    this.selectedbrandid = [];
    this.selectedRegionItems = [];
    this.selectedchkList = [];
    this.regionids = [];
    this.selectedFile='';
    this.incentiveMasterForm = this.fB.group({
      incentivename: ['', Validators.required],
      incentivetype: ['', Validators.required],
      region: [''],
      datefrom: ['', Validators.required],
      dateto: ['', Validators.required],
    });
    console.log(this.incentiveMasterForm.controls);
    let param = this.SearchIncentiveForm.controls['ddldate'].value;
    const obj = { Id: this.incentiveid, expression: '','type':param };
    this.ApiService.postmethod('incentivelist/get', obj).subscribe(
      (response: any) => {
        if (response.status == 200) {
          this.incentiveMasterForm.controls['incentivename'].setValue(response.response[0].MI_NAME);
          this.incentiveMasterForm.controls['incentivetype'].setValue(response.response[0].MI_TYPE_ID);
          if(response.response[0].DocName!=''){
            this.EditView=true;
            this.AddView=false;
          this.selectedFile=response.response[0].DocName;
          }

          const obj1 = { IncentiveId: this.incentiveid, expression: '' };
          this.ApiService.postmethod(
            'incentivemaster/getvariabledata',
            obj1
          ).subscribe((res: any) => {
            if (res.status == 200) {
              let changeformat = '';

              if (res.response.length != 0) {
                for (var i = 0; i < res.response.length; i++) {
                  if (res.response[i].INV_MIV_ID == 8) {
                    let fromdatestring = res.response[i].INV_DATA;

                    if (fromdatestring.indexOf('-') !== -1)
                      this.incentiveMasterForm.controls['datefrom'].setValue(
                        fromdatestring
                      );
                    else {
                      changeformat = this.datepipe.transform(
                        fromdatestring,
                        'yyyy-MM-dd'
                      );
                      this.incentiveMasterForm.controls['datefrom'].setValue(
                        changeformat
                      );
                    }
                  }
                  if (res.response[i].INV_MIV_ID == 9) {
                    let todatestring = res.response[i].INV_DATA;

                    if (todatestring.indexOf('-') !== -1)
                      this.incentiveMasterForm.controls['dateto'].setValue(
                        res.response[i].INV_DATA
                      );
                    else { 
                      changeformat = this.datepipe.transform(
                        todatestring,
                        'yyyy-MM-dd'
                      );
                      this.incentiveMasterForm.controls['dateto'].setValue(
                        changeformat
                      );
                    }
                  }

                  if (res.response[i].VariableName == 'Brand') {
                    let branditem = this.getDimensionsByFind(
                      res.response[i].INV_DATA
                    );
                    //let branditem= this.OemBrands.find(x=> x.brand_chrome_id == res.response[i].INV_DATA)
                    setTimeout(()=>{
                      this.selectedBrandsList.push({
                        brand_chrome_id: branditem.brand_chrome_id,
                        brand_name: branditem.brand_name,
                        brand_logo: branditem.brand_logo,
                      });
                      this.selectedBrandLogo.push(branditem.brand_logo);
                      this.selectedbrandid.push(branditem.brand_chrome_id);
                    },1000);
                    
                   
                  }

                  if (res.response[i].VariableName == 'Region') {
                    this.selectedRegionItems.push({ id: parseInt(res.response[i].INV_DATA), itemName: res.response[i].regioname, });
                    this.regionids.push(parseInt(res.response[i].INV_DATA));
                  }
                  
                }
                this.GetBrandsList();
               // this.showDealerStores(this.regionids)
              }
             // this.getDealerShipsByIncentive(this.incentiveid);
            }
          });
        }
      }
    );
  }
  TermsAndConditionsSave(e) {
    console.log(e);
    this.FinalArray = e;
    const obj = { termsandconditionsdata: this.FinalArray };
    console.log(this.FinalArray);
    if (this.editTerms == '') {
      this.ApiService.postmethod('termsandconditionsdata', obj).subscribe(
        (res: any) => {
          console.log(res);
          if (res.status == 200) {
            //this.router.navigateByUrl('incentiveMaster');
            this.alertify.success('Terms and Conditions Added Successfully');
            this.showIncentiveLineItems = false;
            this.showIncentiveView = true;
           // this.showTermDiv = false;
            this.showIncentiveLineItems = false;
            this.showTermsandConditions = false;
            this.getIncentiveTermaAndConditionsData(this.incentiveid);
            this.showLineItemsLink = true;
           
            if(this.TypeOfView ='E'){
             this.showTermDiv=true;
             this.viewCancel = true;
            }
          }
        }
      );
    } else if (this.editTerms == 'Edit') {
      this.ApiService.putmethod('termsandconditionsdata', obj).subscribe(
        (res: any) => {
          console.log(res);
          if (res.status == 200) {
            //this.router.navigateByUrl('incentiveMaster');
            this.alertify.success('Terms and Conditions Updated Successfully');
            this.showIncentiveLineItems = false;
            this.showIncentiveView = true;
            this.showTermDiv = false;
            this.showIncentiveLineItems = false;
            this.showTermsandConditions = false;
            this.getIncentiveTermaAndConditionsData(this.incentiveid);
            this.showLineItemsLink = true;
            this.viewCancel = false;
            if(this.TypeOfView=='E'){
              this.showTermDiv=true;
              this.viewCancel = true;
            }
          }
        }
      );
    }
  }
  onDetailsCancel(detailView) {
    this.getIncentiveLineItemsData(this._glbIncentiveId);
    this.showIncentiveLineItems = false;
    this.showIncentiveView = true;
    this.showLineItemsLink1 = true;
  }

  EditTermsAndConditions() {
    this.getIncentiveTermsAndConditions();
     this.editTerms = 'Edit';
    // this.showTermsandConditions = true;
  }

  EditLineItems(lineHdrId, squencId) {
    this.detailViewType = 'U';
    this._glbLineHdrId = lineHdrId;
    this._glbLnhdrSeqnId = squencId+1;
    this.lineItemsInfo["lineHdrId"]=lineHdrId;
    this.lineItemsInfo["lineHdrSeqnId"]=squencId+1;
    this.lineItemsInfo["viewType"]="U";
    this.getLineItemsDetails();
   
    // this.showIncentiveLineItems = true;
    
  }

  openModal(id: string) {
    this.modalSrvc.open(id);
    }
    closeModal(id: string) {
    this.modalSrvc.close(id);
    }

    ViewLineItems(){
      this.detailViewType="";
      this._glbLineHdrId=1;
      this.lineItemsInfo["viewType"]="";
      this.lineItemsInfo["lineHdrId"]="1";
      this.getLineItemsDetails();
      
      }
      Processfile(e){
        this.EditView=false;
        this.AddView=true;
        this.selectedFile='';
        this.fileName= e.target.files[0];
        var reader = new FileReader();      
    reader.readAsDataURL(e.target.files[0]); 
    reader.onload = (event) => { 
      this.selectedFile = reader.result;
      };
    }
    openDocument(url){
      var width  = screen.width;
      var height = screen.height;
      // var left   = screen.width - 960;
      // var top    = 20;
      var params = 'width='+width+', height='+height;
      //params += ', top='+top+', left='+left;
      params += ', directories=no';
      params += ', location=no';
      params += ', menubar=no';
      params += ', resizable=yes';
      params += ', scrollbars=no';
      params += ', status=no';
      params += ', toolbar=no'; 
      window.open(this.ImagPath+'/'+url, '_blank', params)
    }
  
}
