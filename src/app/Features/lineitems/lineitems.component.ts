import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
//import { VariablepopupComponent } from '../variablepopup/variablepopup.component';
import {ApiService} from '../../Core/_providers/api-service/api.service'

@Component({
  selector: 'app-lineitems',
  templateUrl: './lineitems.component.html',
  styleUrls: ['./lineitems.component.scss']
})
export class LineitemsComponent implements OnInit {
  LineItemspopupForm: FormGroup;

  Years: any  = [
    {'value':2021,'Year':2021},
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
  brand_id:number;
  Brands: any = [];
    modelData: any = [];
    selectedmodel: any = [];
  
    Styles:any=[];
  modelId: number;
  year: number;
  styleId: number;
  LineItems:any=[];

  constructor(private fB: FormBuilder, private ApiService: ApiService,public dialogRef: MatDialogRef<LineitemsComponent>) { 
    this.LineItemspopupForm = this.fB.group({
      ddlyear: [''],
      ddlbrand:[''],
      ddlmodel : [''],
      ddlstyle : [''],
      unitprice : [''],
      msrp:['']
    });
  }

  ngOnInit(): void {
    this.brand_id=0;
    this.modelId=0;
    this.year=2021;
    this.styleId=0;
    this.getBrands();
  }
  getBrands(){
    const obj={
      "brand_id":this.brand_id
    }

    this.ApiService.postmethod('brands/get',obj).subscribe((resp:any) => {
   
      this.Brands=resp.response;
      //this.brand_id=resp.response[0].brand_id;
      //this.modelForm.controls['ddlBrand'].setValue(this.brand_id);
      this.getModels();
    });
 }



  getModels(){

    this.brand_id= this.LineItemspopupForm.controls['ddlbrand'].value;
    this.year=this.LineItemspopupForm.controls['ddlyear'].value;

    let expr="";
    if(this.year!=0)
       expr= "divisionid =" + this.brand_id + " and modelyear =" + this.year;
    else
       expr="divisionid =" + this.brand_id + "";
      
   const modelObj={
      "modelid":0,
      "expression":expr
    } 

      this.ApiService.postmethod('model/get',modelObj).subscribe( (resp:any) =>{
        console.log("Models List"+resp.response);
        
        if(resp!=null){

            //this.modelId=resp.response[0].modelCode;
            this.modelData=resp.response;
            //this.loadInventory();
         
            this.getStyles();
          }
     });
  }

 

  getStyles(){
      
    let obj={ 
      "p_styleid":0,
      "expression":"year="+this.year+" and divisionid="+this.brand_id+" and modelid="+this.modelId+""
    }

    this.ApiService.postmethod('styles/get',obj).subscribe((resp:any) => {
      
      this.Styles=resp.response;
      //this.styleId=resp.response[0].styleid;
      //this.modelForm.controls['ddlStyle'].setValue(this.styleId);
      
    });
  }
  addLineItemsInfo(){
    //const lineItemsInfo={}
   // if(this.LineItems.length == 0){
    const lineItemsInfo={
     // lineid : 1,
      year:this.LineItemspopupForm.value.ddlyear,
      brand : this.LineItemspopupForm.value.ddlbrand,
      model : this.LineItemspopupForm.value.ddlmodel,
      style : this.LineItemspopupForm.value.ddlstyle,
      unitprice : this.LineItemspopupForm.value.unitprice,
      msrp : this.LineItemspopupForm.value.msrp
    }
    this.LineItems = lineItemsInfo;
 // }
     
     this.dialogRef.close(this.LineItems);

  }
  onkeyPress(event:any){
    const pattern = /[0-9+( )-]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  

  closeLineItemsPopup(){
    this.dialogRef.close();
  }
  assignDropDownInfo(searchType:any){

   
         
    if(searchType=="year")
    {
       
        this.LineItemspopupForm.controls['ddlbrand'].setValue('0');
        this.LineItemspopupForm.controls['ddlmodel'].setValue('0');
        //this.modelForm.controls['ddlStyle'].setValue('0');
     
    }

    if(searchType=="brand")
    { 
      let brdid:number=this.LineItemspopupForm.controls['ddlbrand'].value;
      let brname = this.LineItemspopupForm.controls['ddlbrand']
      console.log("Model very"+brdid);
        if(brdid==0)
        {
           this.modelData=[];
          // this.loadInventory();
        }
        else
           this.getModels();
      
         

        this.LineItemspopupForm.controls['ddlmodel'].setValue('0');
        //this.modelForm.controls['ddlStyle'].setValue('0');
        //this.modelForm.controls['ddlStock'].setValue();

        
        
    }

    if(searchType=="model")
    {
        
        //this.loadInventory();
         this.getStyles();
    }

  
 
}

}
