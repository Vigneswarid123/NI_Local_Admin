import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from "../../Core/_providers/api-service/api.service";
import {VariablepopupComponent} from '../../Features/variablepopup/variablepopup.component'
import { LineitemsComponent } from '../lineitems/lineitems.component';
import { DatePipe } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-incentives',
  templateUrl: './incentives.component.html',
  styleUrls: ['./incentives.component.scss']
})
export class IncentivesComponent implements OnInit {


  incentiveForm: FormGroup;
  SearchIncentiveForm: FormGroup;
  brandform :FormGroup;
  @ViewChild('brand', { static: false }) brand: ElementRef;
  @ViewChild('srchbrnd', { static: false }) srchbrand: ElementRef;

  submitted = false;
  addclick = false;
  showgrid = false;
  noincentive = false;
  incentives :any=[]
  incentiveid:any=0;
  incentivetypes: any=[];
  EditCheck :boolean=false;
  // isChecked: boolean;
  // status: string;
  editStatus: any;

  hide:boolean=false;
  alphaSrch:string='';
  atozFltr:boolean=false;

  alphaColumns:any=["INM_NAME"];
  tempincentives: any=[];
  VariablesData: any=[{}];
  LineItemsData: any=[];
  regionsList: any=[];
  showIncentive :boolean=false;
  incentiveVaraibles: any=[];
  incentiveLineItems: any = [];
  incentivesData: any=[];
  showBrand: boolean;
  OemBrands: any[];
  selectedbrandid: any=[];
  selectedBrands: any=[];
  showBrandDiv: boolean=false;
  selectedBrandLogo: any=[];
  selectedBrandsList: any=[];
  selectedItem: any;
  brandspopup: boolean;
  serachBrands: any;
  selectedSearchBrands: string[];
  showsearchBrandDiv:boolean=false;
  searchbrandid: any;
  selectedchkList: any=[];
  dealershipStores: any=[];
  dvStores :boolean=false;


  constructor(private fB: FormBuilder, private ApiService: ApiService, private renderer: Renderer2, public dialog: MatDialog) {
    this.renderer.listen('window', 'click',(e:Event)=>{
      //console.log(this.menu.nativeElement.value);
      //if(e.target !== this.menu.nativeElement){
        if(this.brand == undefined){
        this.showBrandDiv=false; 
      }
      else
      this.showBrandDiv=false; 
      if(this.srchbrand == undefined){
        this.showsearchBrandDiv=false; 
      }
      else
      this.showsearchBrandDiv=false; 
    });
    this.showgrid = true;
    this.incentiveForm = this.fB.group({
      incentivename: ['', [Validators.required, Validators.maxLength(100)]],
      incentivetype:['',Validators.required],
      status : [false],
      region:[''],
      datefrom : [''],
      dateto : [''],
      availbonus : [''],
      selectall:['']
    }
    // ,
    // {updateOn: 'submit'}
    );
    this.SearchIncentiveForm =this.fB.group({
      txtsearch:"",
      brandtxt:""
    });
   }

  ngOnInit(): void {
    this.getIncentives();
    this.getIncentiveTypes();
    this.getRegions();
    this.GetBrandsList();
    this.brandform = this.fB.group({
      txtbrand: [''],
    
   });
  }
   gblexpression:string="";
  getIncentives(){
    this.incentives =[];
    
    const obj={ 'Id' : this.incentiveid,'expression' : this.gblexpression }
    this.ApiService.postmethod('incentivemaster/get',obj).subscribe((response:any)=>{
      console.log(response);
      if(response.status==200){
        if(response.response.length !=0){
        this.incentives=response.response;
        this.tempincentives = this.incentives;
        }
        else
         this.noincentive=true;
      }
    });
  }

  showAddPanel() {
    this.incentiveid =0;
    this.addclick = true;
    this.showgrid = false;
    this.EditCheck =false;
    this.incentiveForm = this.fB.group({
      incentivename: ['',[Validators.required, Validators.maxLength(51)]],
      incentivetype:['',[Validators.required]],
      status : [false],
      region:[0],
      datefrom : [''],
      dateto : [''],
      availbonus : ['']
    });
   this.LineItemsData=[];
   this.VariablesData=[];
   this.submitted = false;
   this.selectedbrandid =[];
   this.selectedBrandLogo=[];
   this.selectedBrandsList=[];
    
  }
  editIncentive(id){
    this.incentiveid =id;
    this.addclick = true;
    this.showgrid = false;
    this.VariablesData=[];
    this.LineItemsData=[];
    const obj = { "Id": id,"expression":"" };
    this.ApiService.postmethod('incentivemaster/get',obj).subscribe((response:any)=>{
      if(response.status==200){
         this.incentiveForm = this.fB.group({
          incentivename: [response.response[0].INM_NAME, [Validators.required, Validators.maxLength(51)]],
          incentivetype:[response.response[0].INM_INTYPE_ID,Validators.required],
          status : response.response[0].INM_STATUS
         });
         this.EditCheck=true;
         this.editStatus = response.response[0].INM_STATUS;
         if(response.response[0].INM_STATUS == 'Y')
          this.incentiveForm.value.status = true;
        else
        this.incentiveForm.patchValue({status: false});
      }
    });
  }

  checkValue(event){
    if(event.target.checked== true)
    this.editStatus = 'Y';
   else
     this.editStatus = 'N' ;
 }

  getIncentiveTypes(){
    const obj = { "incentivetype_id": 0,"expression":"" };
    this.ApiService.postmethod('incentivetypes/get',obj).subscribe((res:any)=>{
      if(res.status == 200){
        this.incentivetypes = res.response;
      }

    })
  }

  showGridPanel(){
    this.showgrid = true;
    this.addclick = false;
    //this.getIncentives();
  }

  OnSubmit(){
    this.submitted = true;
    if (this.incentiveForm.invalid) {
      return
    }
    if(this.selectedbrandid.length == 0)
     return false;
    if(this.incentiveid == 0){
      // this.VariablesData.availablebonus= this.incentiveForm.value.availbonus;
      // this.VariablesData.regionval = this.incentiveForm.value.region;
      // this.VariablesData.datefrom =  new DatePipe('en-US').transform(this.incentiveForm.value.datefrom, 'dd/MM/yyyy');
      // this.VariablesData.dateto = new DatePipe('en-US').transform(this.incentiveForm.value.dateto, 'dd/MM/yyyy'),
      // this.VariablesData.value="100";

      var list=[];
      for(var i=0;i<this.selectedchkList.length;i++){
        list.push(this.selectedchkList[i].val)
      }
    
      const varobj={
        availablebonus: this.incentiveForm.value.availbonus,
        regionval:this.incentiveForm.value.region,
        datefrom : new DatePipe('en-US').transform(this.incentiveForm.value.datefrom, 'MM/dd/yyyy'),
        dateto : new DatePipe('en-US').transform(this.incentiveForm.value.dateto, 'MM/dd/yyyy'),
        brandid : this.selectedbrandid
      };
      this.VariablesData.push(varobj);
    const obj = {
      inmname : this.incentiveForm.value.incentivename,
      inmtypeid : this.incentiveForm.value.incentivetype,
      inmstatus : 'Y',
      incentivevariabledata:this.VariablesData,
      incentivelineitems : this.LineItemsData,
     // dealer_id : 0
       dealer_id : this.selectedchkList
    }
    console.log(obj)
    // this.ApiService.postmethod('incentivemaster',obj).subscribe((res:any)=>{
    //   if(res.status == 200){
    //      alert ('Incentive Added Successfully');
    //      this.showgrid =true;
    //      this.addclick =false;
    //      this.getIncentives();
    //   }
    // })
  }
  else{
    // if(this.isChecked == true)
    //    this.status='Y';
    // else
    //    this.status='N';
         
    const obj = {
      inmid : this.incentiveid,
      inmname : this.incentiveForm.value.incentivename,
      inmtypeid : this.incentiveForm.value.incentivetype,
      inmstatus : this.editStatus,
      variablesdata:this.VariablesData,
      lineItems : this.LineItemsData
    }
    this.ApiService.putmethod('incentivemaster',obj).subscribe((res:any)=>{
      if(res.status == 200){
         alert ('Incentive Updated Successfully');
         this.showgrid =true;
         this.addclick =false;
         this.getIncentives();
      }
    })
  }
    
  }
  onAlphaCatch(alphabet){
    this.hide=true;
    this.atozFltr=true;
    this.alphaSrch=alphabet;
    this.incentives=this.tempincentives;
    console.log(this.alphaSrch);
  }

  onSearch(){
    
    this.alphaSrch= this.SearchIncentiveForm.controls['txtsearch'].value;
    console.log(this.alphaSrch);
    this.incentives=this.tempincentives;
    
  }

  atoZClick(){
    if(!this.atozFltr)
    this.atozFltr=true;
    else
    this.atozFltr=false;
  }

  OpenVaribalePopUp(){
    const dialogRef = this.dialog.open(VariablepopupComponent, {
      width: '500px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      //const resp = JSON.parse(`${result}`);
      //this.GetBrandsList();
      //console.log('Dialog result:', resp);
      if(result !=undefined){
        this.VariablesData.push(result);
      }
    });
  }

  OpenLineItemsPopUp(){
    const dialogRef = this.dialog.open(LineitemsComponent, {
      width: '400px',
      data: {}
    });
    
    dialogRef.afterClosed().subscribe(result => {
    
      if(result !=undefined){
        this.LineItemsData.push(result);
        if(this.LineItemsData.length > 0)
        {
          for(var i=0;i<this.LineItemsData.length;i++){
           this.LineItemsData[i].lineId = i+1;
          }
        }
      }
     
      // else
      // this.LineItemsData[0].lineId = 1;
    });
  }
  getRegions(){
    const obj = {
      region_id: 0
    };
   this.ApiService.postmethod('regions/get',obj).subscribe((res:any)=>{
     if(res.status == 200){
       this.regionsList = res.response;
     }
   })
  }
  onkeyPress(event:any){
    const pattern = /[0-9+( )-]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  viewIncentive(id): Promise<any>{
    return Promise.resolve((()=>{
    this.incentiveid = id;
    this.showIncentive = true;
    const obj={'id' : id, 'expression' : ''}
    this.ApiService.postmethod('incentivemaster/get',obj).subscribe((res:any)=>{
      if(res.status == 200){
        this.incentives = res.response;
      }
    });
    
  })());
  }
  getVariablesData(): Promise<any>{
    return  Promise.resolve((()=>{
      const obj={'id' : this.incentiveid, 'expression' : ''}
      this.ApiService.postmethod('incentivetypes/get',obj).subscribe((res:any)=>{
        if(res.status == 200){
          this.incentiveVaraibles = res.response;
        }
      });
      return
    })());
   

  }
//   getIncentiveLineItemsData(){
//     const obj={'id' : this.incentiveid, 'expression' : ''}
//     this.ApiService.postmethod('incentivetypes/get',obj).subscribe((res:any)=>{
//       if(res.status == 200){
//         this.incentiveLineItems = res.response;
//       }
//     });
//   }
//   getIncentiveDetailsData(){
//   this.getIncentives().then(data1=>{
//     this.getVariablesData().then(datat2=>{
//       this.getIncentiveLineItemsData();
//     })
//   })
// }

viewIncentiveData(id){
  this.showgrid=false;
  this.showIncentive = true;
  this.incentiveid = id;
  this.ViewIncentives();
  this.getIncentiveVariablesData();
  this.getIncentiveLineItemsData();
}
ViewIncentives(){
  const obj = { "Id": this.incentiveid,"expression":"" };
  this.ApiService.postmethod('incentivemaster/get',obj).subscribe((response:any)=>{
    if(response.status==200){
       this.incentivesData = response.response;
    }
  });
}
getIncentiveVariablesData(): Promise<any>{
      return  Promise.resolve((()=>{
        const obj={'IncentiveId' : this.incentiveid, 'expression' : ''}
        this.ApiService.postmethod('incentivemaster/getvariabledata',obj).subscribe((res:any)=>{
          if(res.status == 200){
            this.incentiveVaraibles = res.response;
          }
        });
        return
      })());
     
  
    }

    getIncentiveLineItemsData(){
          const obj={'IncentiveId' : this.incentiveid, 'expression' : ''}
          this.ApiService.postmethod('incentivemaster/getlineitems',obj).subscribe((res:any)=>{
            if(res.status == 200){
              this.incentiveLineItems = res.response;
            }
          });
        }
        pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
        public date1: Date = new Date();
        public date2: Date = new Date();
      
        display = [];
      
        changeFirstInput(e) {
          this.date1 = new Date(e.target.value.replace(this.pattern, '$3-$2-$1'));
          this.display.push(this.date1);
        }
      
        changeSecondInput(e) {    
          this.date2 = new Date(e.target.value.replace(this.pattern, '$3-$2-$1'));
          this.display.push(this.date2);
          console.log('displayArray', this.display);
        }

        CloseIncetiveView(){
          this.showIncentive =false;
          this.incentiveid =0;
          
          this.incentives =[];
          this.showgrid= true;
          this.getIncentives();
        }


        //Brand Code
        addBrand(){
          this.showBrand = true;
        }
        GetBrandsList() {
          this.OemBrands=[];
          const obj = { "brand_id": 0 };
          this.ApiService.GetOemBrands(obj).subscribe(
            (response: any) => {
              if (response.message == "success") {
                this.OemBrands = response.response;
                this.serachBrands = response.response;
                if(this.selectedbrandid !=''){
                  if(this.selectedbrandid.length >0){
                    for(let i=0;i<this.selectedbrandid.length;i++){
                      //this.Brands.splice(this.selectedbrandid[i],1);
                      this.OemBrands = this.OemBrands.filter(item => item.brand_chrome_id != this.selectedbrandid[i])
                    }
                 }
                }
                //console.log(this.Brands)
              }
             
            });
        }
        filter(val: string): string[] {
          return this.OemBrands.filter(option =>
            option.brand_name.toLowerCase().indexOf(val.toLowerCase()) === 0);
        }
        OnChangeEvent(e){
        
          this.selectedBrands=this.filter(e.target.value.toLowerCase())
          this.showBrandDiv=true;
          
       }
       selectItem(event:Event,item,index){
        event.stopPropagation();
        if(this.selectedbrandid == "")
           this.selectedbrandid=[];
        if(item!=''){
          this.selectedbrandid.push(item.brand_chrome_id);
          this.OemBrands = this.OemBrands.filter(x => x.brand_chrome_id != item.brand_chrome_id);
          this.selectedItem=item;
          this.showBrandDiv=false;
          this.selectedBrandLogo.push(item.brand_logo);
          this.selectedBrandsList.push({brand_id:item.brand_chrome_id,brand_name:item.brand_name,brand_logo : item.brand_logo});
           this.brandform.controls["txtbrand"].setValue("");
        // $(".modal-backdrop").remove();
      
        }
       }
       removeBrandTag(item,index,id){
        this.OemBrands.push({brand_chrome_id:id,brand_name:item});
      
        this.selectedBrandsList.splice(index,1);
        this.selectedbrandid.splice(index,1);
        this.selectedBrandLogo.splice(index,1);
      }
      highlightRow(option){
        this.selectedItem = option.brand_name;
      }
      closeModel(){
   
        $(".modal-backdrop").remove();
        this.showBrand =false;
        this.brandspopup = false;

        //this.dvStores = true;
        this.incentiveForm.controls["region"].setValue("0");
        this.getDealershipListByBrand();
       }
       OnBrandChangeEvent(e){
        this.selectedSearchBrands=this.searchfilter(e.target.value.toLowerCase());
        this.showsearchBrandDiv=true;
        if(this.SearchIncentiveForm.value.brandtxt ==""){
          this.gblexpression = "";
          this.getIncentives();
          this.showsearchBrandDiv=false;
        }

        
       }
       searchfilter(val: string): string[] {
        return this.serachBrands.filter(option =>
          option.brand_name.toLowerCase().indexOf(val.toLowerCase()) === 0);
      }
      selectSearchItem(e,option,i){
      //   this.incentiveForm.patchValue({
      //     brandtxt: [option.brand_name]
      // });
      this.searchbrandid = option.brand_chrome_id;
      this.SearchIncentiveForm = this.fB.group({
        brandtxt: option.brand_name
      });
      this.showsearchBrandDiv=false;
      this.gblexpression = " chromeid = "+this.searchbrandid;
      this.getIncentives();
        
    }
    getDealershipListByBrand(){
      const obj={
        "Brand": this.selectedbrandid,
        "Region": this.incentiveForm.controls['region'].value
    };
      this.ApiService.postmethod('incentivemaster/getdealerstores',obj).subscribe((response:any)=>{
         console.log(response);
         if(response.status==200){
          this.dealershipStores = response.response;
          if(this.dealershipStores.length != 0)
             this.dvStores = true;
           
         }
      });
    }
    onCheckboxChange(e){
      if(e.target.value)
      //console.log(e.target.value)
      this.selectedchkList.push({val:e.target.value});

    }
    onAllCheckboxChangeEvent(e){
      // if(e.target.checked)
      // for (var i = 0; i < this.dealershipStores.length; i++) {
      //   this.dealershipStores[i].isChecked = true;
      // }
      // else{
      //   for (var i = 0; i < this.dealershipStores.length; i++) {
      //     this.dealershipStores[i].isChecked = false;
      //   }
      // }
      const checked = e.target.checked;
      this.dealershipStores.forEach(item =>{ 
        item.selected = checked;
        this.selectedchkList.push({val:item.dealer_id})
      });
    }
    showDealerStores(){
      this.getDealershipListByBrand();
    }

}
