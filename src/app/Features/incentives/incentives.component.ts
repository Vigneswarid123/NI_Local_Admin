import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from "../../Core/_providers/api-service/api.service";
import {VariablepopupComponent} from '../../Features/variablepopup/variablepopup.component'
import { LineitemsComponent } from '../lineitems/lineitems.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-incentives',
  templateUrl: './incentives.component.html',
  styleUrls: ['./incentives.component.scss']
})
export class IncentivesComponent implements OnInit {


  incentiveForm: FormGroup;
  SearchIncentiveForm: FormGroup;

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

  constructor(private fB: FormBuilder, private ApiService: ApiService,  public dialog: MatDialog) {

    this.showgrid = true;
    this.incentiveForm = this.fB.group({
      incentivename: ['', [Validators.required, Validators.maxLength(51)]],
      incentivetype:['',Validators.required],
      status : [false],
      region:[''],
      datefrom : [''],
      dateto : [''],
      availbonus : ['']
    },
    {updateOn: 'submit'});
    this.SearchIncentiveForm =this.fB.group({
      txtsearch:""
    });
   }

  ngOnInit(): void {
    this.getIncentives();
    this.getIncentiveTypes();
    this.getRegions();
  }

  getIncentives(){
    this.incentives =[];
    const obj={ 'Id' : 0,'expression' : '' }
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
    this.addclick = true;
    this.showgrid = false;
    this.EditCheck =false;
    this.incentiveForm = this.fB.group({
      incentivename: ['',[Validators.required, Validators.maxLength(51)]],
      incentivetype:['',[Validators.required]],
      status : [false],
      region:[''],
      datefrom : [''],
      dateto : [''],
      availbonus : ['']
    });
   this.LineItemsData=[];
   this.VariablesData=[];
    
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
    if(this.incentiveid == 0){
      // this.VariablesData.availablebonus= this.incentiveForm.value.availbonus;
      // this.VariablesData.regionval = this.incentiveForm.value.region;
      // this.VariablesData.datefrom =  new DatePipe('en-US').transform(this.incentiveForm.value.datefrom, 'dd/MM/yyyy');
      // this.VariablesData.dateto = new DatePipe('en-US').transform(this.incentiveForm.value.dateto, 'dd/MM/yyyy'),
      // this.VariablesData.value="100";
    
      const varobj={
        availablebonus: this.incentiveForm.value.availbonus,
        regionval:this.incentiveForm.value.region,
        datefrom : new DatePipe('en-US').transform(this.incentiveForm.value.datefrom, 'dd/MM/yyyy'),
        dateto : new DatePipe('en-US').transform(this.incentiveForm.value.dateto, 'dd/MM/yyyy'),
        value : "100"
      };
      this.VariablesData.push(varobj);
    const obj = {
      inmname : this.incentiveForm.value.incentivename,
      inmtypeid : this.incentiveForm.value.incentivetype,
      inmstatus : 'Y',
      incentivevariabledata:this.VariablesData,
      incentivelineitems : this.LineItemsData
    }
    console.log(obj)
    this.ApiService.postmethod('incentivemaster',obj).subscribe((res:any)=>{
      if(res.status == 200){
         alert ('Incentive Added Successfully');
         this.showgrid =true;
         this.addclick =false;
         this.getIncentives();
      }
    })
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
      }
      if(this.LineItemsData.length > 0)
      {
        for(var i=0;i<this.LineItemsData.length;i++){
         this.LineItemsData[i].lineId = i+1;
        }
      }
      else
      this.LineItemsData[0].lineId = 1;
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

}
