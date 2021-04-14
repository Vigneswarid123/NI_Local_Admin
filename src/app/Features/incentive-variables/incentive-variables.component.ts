// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-incentive-variables',
//   templateUrl: './incentive-variables.component.html',
//   styleUrls: ['./incentive-variables.component.scss']
// })
// export class IncentiveVariablesComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }
import { Component, OnInit,ElementRef,Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from '../../Core/_providers/api-service/api.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner"; 
import xml2js from 'xml2js';  
import { HttpClient, HttpHeaders } from '@angular/common/http';  
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-incentive-variables',
  templateUrl: './incentive-variables.component.html',
  styleUrls: ['./incentive-variables.component.scss']
})
export class IncentiveVariablesComponent implements OnInit {
  public xmlItems: any; 

  public Brands: any = [];

  brandForm: FormGroup;
  submitted = false;
  addclick = false;
  showgrid = false;
  SearchBrandForm: FormGroup;


  hide:boolean=false;
  alphaSrch:string='';
  atozFltr:boolean=false;
  incentiveInfo:any=[];
  alphaColumns:any=["MIV_NAME"];
   
  // types: any = [];
  

  EditView = false;
  AddView = false;
  BrandId=0;
  txtsearch: any='';


  selectedBrands: any=[];
  showBrandDiv:boolean=false;
  typelist: any;
  selectedItem: any;
  showBrands: boolean = false;
  selectedBrandsList: any = [];
  showBrandAutofill: boolean;
  brandspopup: boolean = false;
  selectedBrandLogo: any = [];
  selectedbrandid: any = [];
  OemBrands: any[];
  serachBrands: any = [];
  @ViewChild('brandmenu', { static: false }) brandmenu: ElementRef;
  ImagPath: any = `${environment.apiUrl}` + '/resources/images';
  brandforms: FormGroup;
  constructor(private _http: HttpClient,
              private fB: FormBuilder,
              private ApiService: ApiService,
              private sanitizer: DomSanitizer,
              private renderer: Renderer2,
              private router: Router,
              private SpinnerService: NgxSpinnerService) {
                this.renderer.listen('window', 'click', (e: Event) => {
                  if (this.brandmenu == undefined) {
                    this.showBrandAutofill = false;
                  } else this.showBrandAutofill = false;
                });
    this.showgrid = true;
    this.brandForm = this.fB.group({
      incentivename: ['', [Validators.required, Validators.maxLength(51)]],
      incentivedesc: ['',[Validators.required]],
      incentivetype: ['',[Validators.required]],
      incentiveref: [''],
      incentivedisplay:['',[Validators.required]],
      Role_Status: [],
      dealerspecific:['N','']
    });

    this.SearchBrandForm =this.fB.group({
      txtSearch:""
    });
  
    this.brandforms = this.fB.group({
      txtbrand: [''],
    });
  }

  ngOnInit(): void {
    this.GetBrandsList();
    this.loadXML(); 
    // this.router.navigateByUrl('incentivevariables');
    this.GetIncentivevariables();
    this.alphaSrch="";
    this.GetIncentiveTypeList();
  }

  loadXML() {  
    console.log('loadxml')
    this._http.get('../../../assets/users.xml',  
      {  
        headers: new HttpHeaders()  
          .set('Content-Type', 'text/xml')  
          .append('Access-Control-Allow-Methods', 'GET')  
          .append('Access-Control-Allow-Origin', '*')  
          .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method"),  
        responseType: 'text'  
      })  
      .subscribe((data) => {  
        this.parseXML(data)  
          .then((data) => {  
            this.xmlItems = data;  
            console.log(this.xmlItems)
          });  
      });  
  }  
  parseXML(data) {  
    return new Promise(resolve => {  
      var k: string | number,  
        arr = [],  
        parser = new xml2js.Parser(  
          {  
            trim: true,  
            explicitArray: true  
          });  
      parser.parseString(data, function (err, result) {  
        var obj = result.incentivetype;  
        for (k in obj.type) {  
          var item = obj.type[k];  
          arr.push({  
            id: item.id[0],  
            name: item.name[0],  
           
          });  
        }  
        resolve(arr);  
      });  
    });  
  }  
  brndTempData:any=[];
  GetIncentivevariables() {
    
    this.incentiveInfo=[];
    let expression='';

    this.alphaSrch="";
    this.SpinnerService.show();
    if(this.txtsearch !="")
    expression = " INV_NAME like '%"+this.txtsearch+"%'";
    const obj = {
       "variableid": 0,
       "expression": expression 
                };

      this.ApiService.postmethod('incentivevariables/get',obj).subscribe(
      (resp: any) => {
        
        console.log("resp",resp)
        if (resp.message == "success") {
          this.Brands = resp;

        
          this.SpinnerService.hide();
          
          this.incentiveInfo = resp.response;
        console.log("brandincentiveInfo",this.incentiveInfo)

           this.brndTempData=this.incentiveInfo;
         //  this.GetBrandsList();
        }
       
      });
  }
  // clear(){
  //   this.brandForm.value.incentivename="";
  //   this.brandForm.value.incentivetype="";
  //   this.brandForm.value.incentivedesc="";
  //   this.brandForm.value.incentiveref="";

  // }
  OnSubmit() {
    this.submitted = true;
    if (this.brandForm.invalid) {
    //  this.brandForm.markAsPristine
      return
    }
    const formdata:any = new FormData();
    let brid=0;
    
    if(this.BrandId!=0)
       brid=this.BrandId;
     if(this.brandForm.value.dealerspecific==null)  {
      this.brandForm.value.dealerspecific='N';
     }
    const obj = {

      invariablename: this.brandForm.value.incentivename,
      invariabletype: this.brandForm.value.incentivetype,
      invariabledescription: this.brandForm.value.incentivedesc,
      invariablereference: this.brandForm.value.incentiveref,
      invariabledisplayname:this.brandForm.value.incentivedisplay,
      invariablestatus: "Y",
      invariablebrandspecific: this.selectedbrandid.join(','),
      dealerspecific:this.brandForm.value.dealerspecific
    };
       console.log(obj)
     if(brid == 0){
      this.ApiService.postmethod('incentivevariables',obj).subscribe((response:any)=>{
        if(response.status == 200){

        console.log("incentive variables added successfully",response);
          this.brandForm.reset();
          // this.brandForm.markAsPristine();
          // this.brandForm.markAsUntouched();
          this.addclick=false;
          this.showgrid=true;
          this.GetIncentivevariables();
        }
      },
      
     (error) => {
      console.log(error);
    });
   }
  else{
    const obj1 = {
      invariableid: brid,
      invariablename: this.brandForm.value.incentivename,
      invariabletype: this.brandForm.value.incentivetype,
      invariabledescription: this.brandForm.value.incentivedesc,
      invariablereference: this.brandForm.value.incentiveref,
      invariabledisplayname:this.brandForm.value.incentivedisplay,
      invariablestatus: "Y",
      invariablebrandspecific: this.selectedbrandid.join(','),
      dealerspecific:this.brandForm.value.dealerspecific
    };
    console.log("obj1",obj1)
    this.ApiService.putmethod('incentivevariables',obj1).subscribe((response:any)=>{
      console.log("updateresponse",response);
      if(response.status == 200){
        this.submitted = false;

      console.log("incentivevariables updated successfully");
      // this.clear();
         this.addclick=false;
        this.showgrid=true;
        this.GetIncentivevariables();
      }
    },
    
   (error) => {
    console.log(error);
  });
  }
  }
  showAddPanel() {
    this.BrandId=0,
    this.selectedBrandsList=[];
    this.selectedBrandLogo=[];
    this.selectedbrandid= [];
    this.brandForm.reset();
   
    this.addclick = true;
    this.showgrid = false;
    this.AddView = true;
    this.GetBrandsList();
  }
  showGridPanel() {
    this.BrandId=0
    // need to add this line in update solution 
    this.submitted=false
    this.brandForm.reset();
    this.showgrid = true;
    this.addclick = false;
    this.GetIncentivevariables();
  }

  onAlphaCatch(alphabet){
    this.hide=true;
    this.atozFltr=true;
    this.alphaSrch=alphabet;
    this.incentiveInfo=this.brndTempData;
    console.log(this.alphaSrch);
  }

  onSearch(){
    this.alphaSrch= this.SearchBrandForm.controls['txtSearch'].value;
    console.log(this.alphaSrch);
    this.incentiveInfo=this.brndTempData; 
  }

  atoZClick(){
    if(!this.atozFltr)
    this.atozFltr=true;
    else
    this.atozFltr=false;
  }

  editBrand(brid) {
    console.log("editbrid",brid)
    this.EditView = true;
    this.BrandId=brid;
    this.Brands = [];
    this.selectedBrandsList=[];
    this.selectedBrandLogo=[];
    this.selectedbrandid= [];
    this.GetBrandsList();
    const obj = { 'variableid': this.BrandId ,
                	'expression': ''
};
    console.log("obj",obj)
    this.ApiService.postmethod('incentivevariables/get',obj).subscribe((response: any) => {
      console.log("edit",response)
      if (response.status == 200) {
        this.addclick = true;
        this.showgrid = false;
      
        this.brandForm=this.fB.group({​​​​​​​​
        incentivename: [response.response[0].MIV_NAME,[Validators.required]],
        incentivetype :[ response.response[0]. MIV_TYPE,[Validators.required]],
        incentivedesc :[response.response[0].MIV_DESCRIPTION,[Validators.required]],
        incentiveref : [response.response[0].MIV_REFERENCE],
        incentivedisplay:[response.response[0].MIV_DISPLAY_NAME,[Validators.required]],
        dealerspecific:[response.response[0].MIV_DEALER_SPECIFIC],
                }​​​​​​​​)              
                setTimeout(() => {
                  if (response.response[0].MIV_BRAND_SPECIFIC.length!=null) {
                    let result= response.response[0].MIV_BRAND_SPECIFIC.split(',');
                    for(let y in result){
                      let branditem = this.getDimensionsByFind(result[y]);
                      this.selectedBrandsList.push({
                        brand_chrome_id: branditem.brand_chrome_id,
                        brand_name: branditem.brand_name,
                        brand_logo: branditem.brand_logo,
                      });
                      this.selectedBrandLogo.push(branditem.brand_logo);
                     this.selectedbrandid.push(branditem.brand_chrome_id);
                    }                   
                  }  
                }, 1000);
                
        console.log(this.brandForm)     
      }
    });
  }

  getDimensionsByFind(id) {
    return this.OemBrands.find((x) => x.brand_chrome_id == id);
  }

  OnChangeEvent(e){
    this.selectedBrands=this.filter(e.target.value.toLowerCase())
    this.showBrandDiv=true;
 }

 filter(val: string): string[] {
  return this.typelist.filter(option =>
    option.incentivetype_name.toLowerCase().indexOf(val.toLowerCase()) === 0);
}


GetIncentiveTypeList(){ 
  this.typelist=[];
   let expression=''; 
  expression = "";
  const obj = {  "incentivetype_id": "0",
                  "expression": ""
              };
    this.ApiService.postmethod('incentivetypes/get',obj).subscribe((response:any)=>{
       console.log("typelist",response.response)
       if(response.status==200){
          this.typelist=response.response;
       }         
  });
}

highlightRow(option){
  this.selectedItem = option.OEM_Name;
}

addBrand() {
  this.showBrands = true;
}

OnChange(e) {
  this.selectedBrands = this.find(e.target.value.toLowerCase());
  this.showBrandAutofill = true;
}
find(val: string): string[] {
  return this.OemBrands.filter(
    (option) =>
      option.brand_name.toLowerCase().indexOf(val.toLowerCase()) === 0
  );
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
    this.brandforms.controls['txtbrand'].setValue('');
    // $(".modal-backdrop").remove();
  }
}
removeBrandTag(item, index, id) {
  this.OemBrands.push({ brand_chrome_id: id, brand_name: item });

  this.selectedBrandsList.splice(index, 1);
  this.selectedbrandid.splice(index, 1);
  this.selectedBrandLogo.splice(index, 1);
}

highlightRows(option) {
  this.selectedItem = option.brand_name;
}

closeModel() {
  $('.modal-backdrop').remove();
  $('body').removeClass('modal-open');
  this.showBrands = false;
  this.brandspopup = false;
}

GetBrandsList() {
  this.OemBrands = [];
  const obj = { brand_id: 0 };
  this.ApiService.postmethod('oembrands/get', obj).subscribe(
    (response: any) => {
      if (response.message == 'success') {
        this.OemBrands = response.response;
        this.serachBrands = response.response;
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

getdealerValue(eva) {
  
  if (eva.target.checked == true) {
    console.log('read', eva.target.checked);
         this.brandForm.value.dealerspecific = 'Y';
   } 
   else 
   {
      this.brandForm.value.dealerspecific = 'N';
   }
 
}

// checkAction(val) {
//   console.log('Check Val :', val)
//   if (val == 'Y')
//     return true;
//   else
//     return false;
// }


}



