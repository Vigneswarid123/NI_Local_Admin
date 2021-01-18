import { AlertifyService } from './../../Core/_providers/alert-service/alertify.service';
import { InventoryService } from './../../Core/_providers/inventory-service/inventory.service';
import { CommonService } from './../../Core/_providers/common-service/common.service';
import { ApiService } from './../../Core/_providers/api-service/api.service';
import { Component, OnInit,Input, Output, EventEmitter  } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";



@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {


    Brands: any = [];
    modelData: any = [];
    selectedmodel: any = [];
    inventryInfo:any=[];
    Styles:any=[];
    invtryOrgExcAlpha:any=[];
    invtryIncludeAlpha:any=[];
    // alphaColumns:any=[{colName1:"ModelName",colName2:"MakeName"}];
    alphaColumns:any=["ModelName","MakeName"];
    

    


  atozFltr:boolean=false;
  dfltStat:boolean;
  brand_id:number;
  submitted = false;
  Show:boolean;
  hide:boolean=false;
  id:number;
  modelId:number;
  year:number;
  styleId:number;
  vin:string;
  stockType:string;
  tableResult:string;
  alphaSrch:string='';

  Years: any  = [
    {'value':2020,'Year':2020},
    {'value':2019,'Year':2019},
    {'value':2018,'Year':2018},
    {'value':2017,'Year':2017},
    {'value':2016,'Year':2016},
    {'value':2015,'Year':2015},
    {'value':2014,'Year':2014},
    {'value':2013,'Year':2013},
    {'value':2012,'Year':2012},
    {'value':2011,'Year':2011},
    {'value':2010,'Year':2010},
    {'value':2009,'Year':2009}
  ]

  constructor( public fb:FormBuilder,private apiSrvc:ApiService,private router:Router,private SpinnerService: NgxSpinnerService,private dfltSrvc:CommonService,
                 private invrSrvc:InventoryService,private alertify:AlertifyService) { }
                
  modelForm=this.fb.group({
    ddlYear:['',''],
    ddlBrand:['',''],
    ddlModel:['',''],
    ddlStyle:['',''],
    ddlStock:['',''],
    txtVin:""
    // year: ['', [Validators.required]],
    // model: ['', [Validators.required]]
  })

  ngOnInit(): void {
    this.dfltStat=true;
    this.router.navigateByUrl('inventory');
  
    this.Show=true;
    this.hide=false;
    this.brand_id=0;
    this.modelId=0;
    this.year=2020;
    this.styleId=0;
    this.alphaSrch="";
    this.modelForm.controls['ddlYear'].setValue('2020');
    this.modelForm.controls['ddlStock'].setValue('0');

    this.SpinnerService.show();
     this.getBrands();
    
   
  }


  getBrands(){
    const obj={
      "brand_id":this.brand_id
    }

    this.dfltSrvc.getBrands(obj).subscribe((resp:any) => {
   
      this.Brands=resp.response;
      //this.brand_id=resp.response[0].brand_id;
      //this.modelForm.controls['ddlBrand'].setValue(this.brand_id);
      this.getModels();
    });
 }



  getModels(){

    this.brand_id= this.modelForm.controls['ddlBrand'].value;
    this.year=this.modelForm.controls['ddlYear'].value;

    let expr="";
    if(this.year!=0)
       expr= "divisionid =" + this.brand_id + " and modelyear =" + this.year;
    else
       expr="divisionid =" + this.brand_id + "";
      
   const modelObj={
      "modelid":0,
      "expression":expr
    } 

      this.dfltSrvc.getModelDetails(modelObj).subscribe( (resp:any) =>{
        console.log("Models List"+resp.response);
        
        if(resp!=null){

            //this.modelId=resp.response[0].modelCode;
            this.modelData=resp.response;
            this.loadInventory();
         
            //this.getStyles();
          }
     });
  }

 

  getStyles(){
      
    let obj={ 
      "p_styleid":0,
      "expression":"year="+this.year+" and divisionid="+this.brand_id+" and modelid="+this.modelId+""
    }

    this.dfltSrvc.getStyles(obj).subscribe((resp:any) => {
      
      this.Styles=resp.response;
      //this.styleId=resp.response[0].styleid;
      //this.modelForm.controls['ddlStyle'].setValue(this.styleId);
      
    });
  }

  onSubmit(){
      this.vin="";
      this.submitted=true;
      this.modelForm.controls['txtVin'].untouched;
      if(this.modelForm.controls['txtVin'].value!="")
      {
         this.vin=this.modelForm.controls['txtVin'].value;
         let expr="cdk.VIN like '%"+this.vin+"%'";
        
          this.getInventories(expr);
          this.resetDropDown(); 
      }
      else{
        this.alertify.error("please enter vin");}
          
  }

  onEnter($event){
    $event.target.blur();
    this. onSubmit();
  }

  loadInventory(){
    let expr="cdk_status='Y'";
   
      //retrieving deropdown values
      this.year=this.modelForm.controls['ddlYear'].value;
      this.brand_id=this.modelForm.controls['ddlBrand'].value;
      this.modelId=this.modelForm.controls['ddlModel'].value;
      // this.modelForm.controls['ddlStyle'].setValue('0');
      this.stockType= this.modelForm.controls['ddlStock'].value;


      if(this.dfltStat==true)
       this.year=2020;
   


     if(this.year!=0)
     {
           if(this.dfltStat==true)
              expr+=" and cdk.year="+this.year+" and cdk.StockType like '%New%'";
            else
              expr+=" and cdk.year="+this.year+"";
     }
     if(this.brand_id!=0)
              expr+=" and cdk.brandid="+this.brand_id+"";
     if(this.modelId!=0)
              expr+=" and cdk.modelid="+this.modelId+"";
     if(this.stockType!="0")
              expr+=" and cdk.StockType like '%"+this.stockType+"%'";


      this.resetDropDown();    
      this.getInventories(expr);
  }


  resetDropDown(){

    this.vin=this.modelForm.controls['txtVin'].value;
    this.stockType=this.modelForm.controls['ddlStock'].value;
    this.brand_id=this.modelForm.controls['ddlBrand'].value;
    this.modelId=this.modelForm.controls['ddlModel'].value;

    if(this.vin!=""){
      this.modelForm.controls['ddlYear'].setValue(this.inventryInfo[0].Year);
      this.modelForm.controls['ddlBrand'].setValue('0');
      this.modelForm.controls['ddlModel'].setValue('0');
      //this.modelForm.controls['ddlStyle'].setValue('0');
      this.modelForm.controls['ddlStock'].setValue(this.inventryInfo[0].StockType);
    }

    if(this.year==0 && this.srchType=="year"){
      
      this.modelForm.controls['ddlBrand'].setValue('0');
      this.modelForm.controls['ddlModel'].setValue('0');
      //this.modelForm.controls['ddlStyle'].setValue('0');
      this.modelForm.controls['ddlStock'].setValue('NEW');
    }

    if(this.brand_id==0){
      this.modelForm.controls['ddlModel'].setValue('0');
    }

    if(this.dfltStat==true){
      this.modelForm.controls['ddlYear'].setValue(this.year);
      this.modelForm.controls['ddlBrand'].setValue('0');
      this.modelForm.controls['ddlModel'].setValue('0');
      //this.modelForm.controls['ddlStyle'].setValue('0');
      this.modelForm.controls['ddlStock'].setValue('NEW');

    }

  }

  getInventories(expr){
      this.dfltStat=false;
      
      const data={"dealerId":1,"expression":expr };

      this.inventryInfo=[];

     this.invrSrvc.getInventories(data).subscribe((resp:any) =>{
        this.alphaSrch="";
        if(resp.status == "200"){
          if(resp.response!=null){
            this.hide=false;
            this.inventryInfo=resp.response.Inventory.InventoryData;
            this.invtryOrgExcAlpha=resp.response.Inventory.InventoryData;
            // console.log("Inventory Info"+this.inventryInfo);
          }
          else{ this.hide=true;}
            this.SpinnerService.hide();
        }
      
    });

    this.SpinnerService.hide();
  }



   srchType:string;
  assignDropDownInfo(searchType:any){

      this.atozFltr=false;
      this.SpinnerService.show();
      this.modelForm.controls['txtVin'].setValue("");

      this.srchType=searchType;
           
      if(searchType=="year")
      {
         
          this.modelForm.controls['ddlBrand'].setValue('0');
          this.modelForm.controls['ddlModel'].setValue('0');
          //this.modelForm.controls['ddlStyle'].setValue('0');
          this.modelForm.controls['ddlStock'].setValue('NEW');
        
          this.loadInventory();
      }

      if(searchType=="brand")
      { 
        let brdid:number=this.modelForm.controls['ddlBrand'].value;
        console.log("Model very"+brdid);
          if(brdid==0)
          {
             this.modelData=[];
             this.loadInventory();
          }
          else
             this.getModels();
        
           

          this.modelForm.controls['ddlModel'].setValue('0');
          //this.modelForm.controls['ddlStyle'].setValue('0');
          //this.modelForm.controls['ddlStock'].setValue();

          
          
      }

      if(searchType=="model")
      {
          
          this.loadInventory();
          // this.getStyles();
      }

      if(searchType=="style")
      {

         this.loadInventory();

      }

      if(searchType=="stock"){
         
        this.loadInventory();

      }

     
   
  }


  onAlphaCatch(alphabet){

    this.hide=true;
    this.alphaSrch=alphabet;
    this.inventryInfo=this.invtryOrgExcAlpha;
    
  
  }

  atoZClick(){
  
    if(!this.atozFltr)
    this.atozFltr=true;
    else
    this.atozFltr=false;
  }

}
