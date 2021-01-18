import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { ApiService } from "../../Core/_providers/api-service/api.service";
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner"; 


@Component({
  selector: 'app-model-list',
  templateUrl: './model-list.component.html',
  styleUrls: ['./model-list.component.scss']
})
export class ModelListComponent implements OnInit {
  SearchText: any;
  submitted = false;
  Show:boolean;
  hide:boolean;
  id:number;
  brand_id:number;
  public Brands: any = [];
  public modelList: any = [];
  public selectedmodel: any = [];
  Models:number;
  year:number;
  Result:string;
Years: any  = [
  // {'value':2020,'Year':2020},
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
 
alphaSrch:string='';
atozFltr:boolean=false;
ModelInfo:any=[];
alphaColumns:any=["modelName","div_name"];
modelTempData:any=[];
 

  constructor(public fb: FormBuilder,private APIService:ApiService,private router: Router,private SpinnerService: NgxSpinnerService) { 
   
  }
 
  modelForm = this.fb.group({
    year: ['', ''],
    model: ['', '']

    // year: ['', [Validators.required]],
    // model: ['', [Validators.required]]
  })

  SearchModelForm =this.fb.group({
    txtSearch:""
  });


  ngOnInit(): void {
    this.router.navigateByUrl('Models');
    this.SpinnerService.show()
    this.Show=true;
    this.hide=false;
  this.brand_id=0;
  this.alphaSrch="";
  this.Models=0;
  this.year=2020;
  this.getbrandlist();

  const obj3={
    "modelid":0,
    "expression":"divisionid =0 and modelyear =2020"
  } 
    this.APIService.getModelDetails(obj3).subscribe( (resp:any) => {
    console.log(resp)
    this.modelList=resp;
    this.ModelInfo = resp.response;
      this.modelTempData=resp.response;
      console.log("Models Info"+this.ModelInfo);
      console.log("ModelTampadata"+this.modelTempData);
    this.SpinnerService.hide();
   });

  }
 
getbrandlist(){
  const obj={
    "brand_id":this.brand_id
  }
  console.log(this.brand_id)
  this.APIService.getBrand(obj).subscribe(
    response => {
      console.log(response)
    this.Brands=response;
     // this.BrandContant=this.Brands.response[0].brand_id.toString();
    });
  
}
getid(e){
 console.log(e.target.value)
this.Models=e.target.value;

//console.log(this.Models)
 

}
getmodellist(){
  this.ModelInfo=[];
  this.SpinnerService.show();
 const obj2={
  "modelid":0,
  "expression":"divisionid =" + this.Models + " and modelyear =" + this.year
} 
console.log(obj2)
// this.APIService.getModelDetails(obj2).subscribe( response => {
//   console.log(response)
 
//     this.modelList=response;
//     this.ModelInfo = response;
//     this.modelTempData=this.ModelInfo;
    

//  if(this.modelList.response==''){
//  this.Result="No Result Found!!!"
//  this.hide=true
//  }
//  else{
//    this.hide=false
//  }
//  this.SpinnerService.hide();
// });

this.APIService.getModelDetails(obj2).subscribe(
  (resp: any) => {
    if (resp.message == "success") {
     
      this.modelList= resp.response;
      this.ModelInfo = resp.response;
      this.modelTempData=resp.response;
      console.log("Models List"+this.ModelInfo);
      console.log("ModelTampadata"+this.modelTempData);
    }
    
  });


}


// public handleError = (controlName: string, errorName: string) => {
//   return this.modelForm.controls[controlName].hasError(errorName);
// }


  onSubmit()   {

    this.submitted=true;
      if (this.modelForm.invalid) {
    alert("please select value")
   }
    
    this.getmodellist();
   
  }


  visible(e){
    // this.Show=true;
    this.year=e.target.value;
    console.log(this.year);
  }

  action(value) {
    // console.log(value);  
   this.selectedmodel.push(value);
   //console.log(this.admin);
   console.log(this.selectedmodel);
   console.log("id"+this.selectedmodel[0].modelId);
   this.id=this.selectedmodel[0].modelId;
  //  console.log(this.id)
   
     this.router.navigate(['Editmodel'], { queryParams: { modelid:this.id, divisionid:this.Models, modelyear:this.year} }); 
   
   }

   onAlphaCatch(alphabet){
    this.hide=true;
    this.atozFltr=true;
    this.alphaSrch=alphabet;
    this.ModelInfo =this.modelTempData;
    console.log("Alphabet"+this.alphaSrch);
  }

  onSearch(){
    this.alphaSrch= this.SearchModelForm.controls['txtSearch'].value;
    console.log(this.alphaSrch);
    this.ModelInfo=this.modelTempData;
  }

  atoZClick(){
    if(!this.atozFltr)
    this.atozFltr=true;
    else
    this.atozFltr=false;
  }

}
