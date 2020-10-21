import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { ApiService } from "../_services/api.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-model-list',
  templateUrl: './model-list.component.html',
  styleUrls: ['./model-list.component.scss']
})
export class ModelListComponent implements OnInit {
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



  constructor(public fb: FormBuilder,private APIService:ApiService,private router: Router) { }
 
  modelForm = this.fb.group({
    year: ['', ''],
    model: ['', '']

    // year: ['', [Validators.required]],
    // model: ['', [Validators.required]]
  })

  ngOnInit(): void {
    this.Show=true;
    this.hide=false;
  this.brand_id=0;

  this.Models=0;
  this.year=2020;
  this.getbrandlist();

  const obj3={
    "modelid":0,
    "expression":"divisionid =0 and modelyear =2020"
  } 
    this.APIService.getModelDetails(obj3).subscribe( response => {
    console.log(response)
    this.modelList=response;
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
 const obj2={
  "modelid":0,
  "expression":"divisionid =" + this.Models + " and modelyear =" + this.year
} 
console.log(obj2)
this.APIService.getModelDetails(obj2).subscribe( response => {
  console.log(response)
 
    this.modelList=response;
  
 if(this.modelList.response==''){
 this.Result="No Result Found!!!"
 this.hide=true
 }
 else{
   this.hide=false
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
}
