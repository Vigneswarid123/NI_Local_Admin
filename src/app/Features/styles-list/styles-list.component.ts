import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../Core/_providers/api-service/api.service';
import { NgxSpinnerService } from "ngx-spinner"; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-styles-list',
  templateUrl: './styles-list.component.html',
  styleUrls: ['./styles-list.component.scss']
})
export class StylesListComponent implements OnInit {


  public Brands:any = [];
  public Models:any=[];
  public Styles:any=[];
  obj: any = [];
  obj1:any=[];
  obj2:any=[];
  //settings:any=false;
  //letters:any=false;
  
  Years = [{'value':0,'Year':'Select Year'},{'value':2020,'Year':2020},{'value':2019,'Year':2019},{'value':2018,'Year':2018},
  {'value':2017,'Year':2017},{'value':2016,'Year':2016},{'value':2015,'Year':2015},{'value':2014,'Year':2014},
  {'value':2013,'Year':2013},{'value':2012,'Year':2012},{'value':2011,'Year':2011},{'value':2010,'Year':2010},
  {'value':2009,'Year':2009},{'value':2008,'Year':2008},{'value':2007,'Year':2007},{'value':2006,'Year':2006},
  {'value':2005,'Year':2005},{'value':2004,'Year':2004},{'value':2003,'Year':2003},{'value':2002,'Year':2002},
  {'value':2001,'Year':2001},{'value':2000,'Year':2000},{'value':1999,'Year':1999},{'value':1998,'Year':1998},
  {'value':1997,'Year':1997} ]
  YearContant = '0';
  BrandContant:any=0;
  ModelContant:any=0;
  Band:any=false;
  Yar:any=false;
  Mdel:any=false;
  GridView:any=false;
  //StylesCount:any;
  constructor(private ApiService:ApiService,private SpinnerService: NgxSpinnerService, private router: Router) { }

  ngOnInit(): void {
    this.router.navigateByUrl('Styles');
   this.BrandsList();
  }

  BrandsList() {
    this.SpinnerService.show();  
      const obj={brand_id:0};
      this.ApiService.postmethod('brands/GET', this.obj).subscribe(
        response => {
          this.Brands=response;
          this.SpinnerService.hide(); 
          //this.BrandContant=0;
    });
  }


  synchroMembre(value, typechange) {
    if (typechange == 'B') {
     this.BrandContant=value.target.value;
     if(this.BrandContant!=0 &&  this.YearContant!='0'){
      this.ModelList(this.BrandContant,this.YearContant);
    }
    }else if(typechange=='Y'){
      this.YearContant=value;
      if(this.BrandContant!=0 &&  this.YearContant!='0'){
        this.ModelList(this.BrandContant,this.YearContant);
      }
    }
    // else{
    //   if(this.BrandContant!=0 &&  this.YearContant!='0'){
    //     this.ModelList(this.BrandContant,this.YearContant);
    //   }
    // }
  }

  ModelList(bid,yid){
    this.SpinnerService.show();  
    const obj1={
      "modelid":0,
      "expression":"divisionid="+bid+" and modelyear="+yid
    }
 
    this.ApiService.getModelDetails(obj1).subscribe(
      response => {    
       this.Models=response;
       this.SpinnerService.hide();  
      });
  }


  OnSubmit(){
    if(this.BrandContant=='0'){
      this.Band=true;
    }else{
      this.Band=false;
    }
    if(this.YearContant=='0'){
      this.Yar=true;
    }else{
      this.Yar=false;
    }
    if(this.ModelContant=='' || this.ModelContant==undefined){
     this.Mdel=true;
     return
    }else{
      this.Mdel=false;
    }
    this.StylesList(this.BrandContant,this.YearContant,this.ModelContant);
  }
  
  StylesList(BC,YR,MC){
    this.SpinnerService.show();  
    const obj2={
      "style_id":0,
      "expression":"modelid="+MC+" and modelyear= "+YR+" and divisionid="+BC+""
    };
    this.ApiService.GetStylesDataValue(obj2).subscribe(
      response => {    
       this.GridView=true; 
       this.Styles=response; 
       this.SpinnerService.hide();  
     //  this.StylesCount=this.Styles.response.length;
      });      
  }
}
