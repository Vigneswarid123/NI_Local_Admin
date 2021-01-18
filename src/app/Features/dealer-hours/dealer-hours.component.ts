import { Component, OnInit } from '@angular/core';
import { ApiService } from'../../Core/_providers/api-service/api.service';
import { NgxSpinnerService } from "ngx-spinner"; 
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AlertifyService } from '../../Core/_providers/alert-service/alertify.service';
declare var $: any;

@Component({
  selector: 'app-dealer-hours',
  templateUrl: './dealer-hours.component.html',
  styleUrls: ['./dealer-hours.component.scss']
})
export class DealerHoursComponent implements OnInit {
  dealersHoursTimings : any = [];
  GetDealershipsList : any = [];
  dealergroups:any=[];
  showdata : any = false;
  selectedDealer: any;
  holidaysList  : any = [];  
  StrHldyform : FormGroup;
  action: any = 'A';
  status: any ;
  hoursrecordd : any;
  AddEdit : any = false;
  submitted = false;
  isLoading     : any = false;
  constructor(private ApiService: ApiService,private SpinnerService: NgxSpinnerService,
     private formBuilder: FormBuilder,private alertify: AlertifyService) {
    this.getStoreHolidaysList();
    this.getGroups();
   }

  ngOnInit(): void {
    this.StrHldyform = this.formBuilder.group({
      id: [],
     toDte: ['',[Validators.required]],
     frmDte: ['',[Validators.required]],
      status: [],
     hldyName: ['',[Validators.required]]
   });
  }

  //Save Salers Hours
  saveSalersHours(){
    // console.log("Final Object :",this.dealersHoursTimings);
     console.log("Selected Obj :", this.selectedDealer);
    const finaObj = {
         // "action"  :   "S",
          "DID"     :   this.selectedDealer,
          "Dw_Day0StartTime"      : this.getTruevalue(this.dealersHoursTimings[0].value),
          "Dw_Day0EndTime"        : this.getTruevalue(this.dealersHoursTimings[0].highValue),
          "Dw_0Off"               : this.getTruevalue(this.dealersHoursTimings[0].ds_off),
          "Dw_Day1StartTime"      : this.getTruevalue(this.dealersHoursTimings[1].value),
          "Dw_Day1EndTime"        : this.getTruevalue(this.dealersHoursTimings[1].highValue),
          "Dw_1Off"               : this.getTruevalue(this.dealersHoursTimings[1].ds_off),
          "Dw_Day2StartTime"      : this.getTruevalue(this.dealersHoursTimings[2].value),
          "Dw_Day2EndTime"        : this.getTruevalue(this.dealersHoursTimings[2].highValue),
          "Dw_2Off"               : this.getTruevalue(this.dealersHoursTimings[2].ds_off),
          "Dw_Day3StartTime"      : this.getTruevalue(this.dealersHoursTimings[3].value),
          "Dw_Day3EndTime"        : this.getTruevalue(this.dealersHoursTimings[3].highValue),
          "Dw_3Off"               : this.getTruevalue(this.dealersHoursTimings[3].ds_off),
          "Dw_Day4StartTime"      : this.getTruevalue(this.dealersHoursTimings[4].value),
          "Dw_Day4EndTime"        : this.getTruevalue(this.dealersHoursTimings[4].highValue),
          "Dw_4Off"               : this.getTruevalue(this.dealersHoursTimings[4].ds_off),
          "Dw_Day5StartTime"      : this.getTruevalue(this.dealersHoursTimings[5].value),
          "Dw_Day5EndTime"        : this.getTruevalue(this.dealersHoursTimings[5].highValue),
          "Dw_5Off"               : this.getTruevalue(this.dealersHoursTimings[5].ds_off),
          "Dw_Day6StartTime"      : this.getTruevalue(this.dealersHoursTimings[6].value),
          "Dw_Day6EndTime"        : this.getTruevalue(this.dealersHoursTimings[6].highValue),
          "Dw_6Off"               : this.getTruevalue(this.dealersHoursTimings[6].ds_off),
          "Dw_WorkWeek"           : "firstweek",
          "Dw_WorkWeekNo"         : "2",
          "Dw_Status"             : "Y"
      }

      console.log("OutUp :", finaObj);
      console.log('St id: ',this.selectedDealer);  
      if(this.selectedDealer){
            
        this.ApiService.updateDealersHours(finaObj).subscribe(
          data => {
              console.log("Updated Response :", data);
              if(data['status'] == 200){
                this.gettingDealersHours(this.selectedDealer);
              }
        });       
      }
  }
  
  //Check box change
  checkBoxChange(obj,evnt,ind){
    //console.log(evnt.target.checked);
    if(evnt.target.checked){
      if(confirm("Are you sure you are selecting more than one off for a week!")){       
        this.dealersHoursTimings[ind].ds_off = 'Y';
      }
    }else{
        this.dealersHoursTimings[ind].ds_off = 'N';
    }     
    //console.log('Main obj', this.dealersHoursTimings);
  }

  changeVal(val1,val2){
    console.log("val 1", val1);
    console.log("val 2", val2);
    console.log("Main Obj", this.dealersHoursTimings);
  }


  getGroups(){
    const obj={  "dealergroupid": 0, "expression": "dg_status = 'Y'"}
    this.ApiService.GetDealershipGroups(obj).subscribe((resp:any)=>{
      if(resp.status = 200){
        if(resp.response[0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B'] !=""){
          this.dealergroups = JSON.parse(resp.response[0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B']);
      }
    }
    });
    
  }

  changeGroup(grpid){
    this.SpinnerService.show(); 
    this.showdata=false; 
    this.getDealerships(grpid);
  }
  
  getDealerships(grpid) {​​​​​​​​
const bd = {​​​​​​​​
//"dealerid":0
"dealerid":0,
"expression":"dealer_dg_id =" + grpid
    }​​​​​​​​;
this.ApiService.dealershipList(bd).subscribe((data: any) => {​​​​​​​​
console.log("Dealser Ship List :", data);
if (data.status == 200) {​​​​​​​​
this.GetDealershipsList = JSON.parse(data.response[0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B']);
this.SpinnerService.hide();  
      }​​​​​​​​else{
        this.SpinnerService.hide();
      }
    }​​​​​​​​);
  }​​​​​​​​

  getDealerId(did){
    console.log('Selected Dealer Id :', did);
    this.SpinnerService.show(); 
    this.isLoading = true;
    this.selectedDealer = did; 
    this.gettingDealersHours(did);
}


//Getting Dealers Hours List
gettingDealersHours(delrId){
  this.isLoading = true;
  const obj = {
    "id":"0",
    "expression":"ds_dealerid='"+delrId+"'"
    }

  this.dealersHoursTimings = [];
  this.ApiService.getDealersHoursList(obj).subscribe(
    data => {
      if(data['status'] == 200){
        console.log("Dealers Hours :", data);

        const respDt = data['response'][0];

        if(data['response'][0]){
          console.log("Has Data...!");
          this.dealersHoursTimings = [
            {
              week : 'Monday',
              ds_off : respDt.DS_MONOFF,
              value: this.convertTimeFormat(respDt.DS_MONSTARTTIME),
              highValue:  this.convertTimeFormat(respDt.DS_MONENDTIME),
              options: {
                floor: 4,
                ceil: 22,
               
                translate: (value: number): string => {
                  return  this.getTruevalue(value);
                }
              }
            },
            {
              week : 'Tuesday',
              ds_off : respDt.DS_TUEOFF,
              value: this.convertTimeFormat(respDt.DS_TUESTARTTIME),
              highValue:  this.convertTimeFormat(respDt.DS_TUEENDTIME),
              options: {
                floor: 4,
                ceil: 22,
               
                translate: (value: number): string => {
                  return  this.getTruevalue(value);
                }
              }
            },
            {
              week : 'Wednesday',
              ds_off : respDt.DS_WEDOFF,
              value: this.convertTimeFormat(respDt.DS_WEDSTARTTIME),
              highValue:  this.convertTimeFormat(respDt.DS_WEDENDTIME),
              options: {
                floor: 4,
                ceil: 22,
               
                translate: (value: number): string => {
                  return  this.getTruevalue(value);
                }
              }
            },
            {
              week : 'Thursday',
              ds_off : respDt.DS_THUOFF,
              value: this.convertTimeFormat(respDt.DS_THUSTARTTIME),
              highValue:  this.convertTimeFormat(respDt.DS_THUENDTIME),
              options: {
                floor: 4,
                ceil: 22,
               
                translate: (value: number): string => {
                  return  this.getTruevalue(value);
                }
              }
            },
            {
              week : 'Friday',
              ds_off : respDt.DS_FRIOFF,
              value: this.convertTimeFormat(respDt.DS_FRISTARTTIME),
              highValue:  this.convertTimeFormat(respDt.DS_FRIENDTIME),
              options: {
                floor: 4,
                ceil: 22,
               
                translate: (value: number): string => {
                  return  this.getTruevalue(value);
                }
              }
            },
            {
              week : 'Saturday',
              ds_off : respDt.DS_SATOFF,
              value: this.convertTimeFormat(respDt.DS_SATSTARTTIME),
              highValue:  this.convertTimeFormat(respDt.DS_SATENDTIME),
              options: {
                floor: 4,
                ceil: 22,
               
                translate: (value: number): string => {
                  return  this.getTruevalue(value);
                }
              }
            },
            {
              week : 'Sunday',
              ds_off : respDt.DS_SUNOFF,
              value: this.convertTimeFormat(respDt.DS_SUNSTARTTIME),
              highValue:  this.convertTimeFormat(respDt.DS_SUNENDTIME),
              options: {
                floor: 4,
                ceil: 22,
               
                translate: (value: number): string => {
                  return  this.getTruevalue(value);
                }
              }
            }
            
          ]
        }else{
          console.log("No Data...!");
          this.dealersHoursTimings = [
            {
              week : 'Monday',
              ds_off : 'N',
              value: 8,
              highValue:  22,
              options: {
                floor: 4,
                ceil: 22,
               
                translate: (value: number): string => {
                  return  this.getTruevalue(value);
                }
              }
            },
            {
              week : 'Tuesday',
              ds_off : 'N',
              value: 8,
              highValue:  22,
              options: {
                floor: 4,
                ceil: 22,
               
                translate: (value: number): string => {
                  return  this.getTruevalue(value);
                }
              }
            },
            {
              week : 'Wednesday',
              ds_off : 'N',
              value: 8,
              highValue:  22,
              options: {
                floor: 4,
                ceil: 22,
               
                translate: (value: number): string => {
                  return  this.getTruevalue(value);
                }
              }
            },
            {
              week : 'Thursday',
              ds_off : 'N',
              value: 8,
              highValue:  22,
              options: {
                floor: 4,
                ceil: 22,
               
                translate: (value: number): string => {
                  return  this.getTruevalue(value);
                }
              }
            },
            {
              week : 'Friday',
              ds_off : 'N',
              value: 8,
              highValue:  22,
              options: {
                floor: 4,
                ceil: 22,
               
                translate: (value: number): string => {
                  return  this.getTruevalue(value);
                }
              }
            },
            {
              week : 'Saturday',
              ds_off : 'Y',
              value: 8,
              highValue:  22,
              options: {
                floor: 4,
                ceil: 22,
               
                translate: (value: number): string => {
                  return  this.getTruevalue(value);
                }
              }
            },
            {
              week : 'Sunday',
              ds_off : 'Y',
              value: 8,
              highValue:  22,
              options: {
                floor: 4,
                ceil: 22,
               
                translate: (value: number): string => {
                  return  this.getTruevalue(value);
                }
              }
            }
            
          ]
        }
      }      

      console.log("my obj ",this.dealersHoursTimings); 
      this.isLoading = false;  
      this.showdata = true;
      this.SpinnerService.hide();
  });
  
}

//Convert 24hrs time to 12hrs time
getTruevalue(val){
  if(val < 12){
    return val+':00 AM';
  }else if(val >= 12){
    var vals = ((val + 11) % 12 + 1);
    return vals+':00 PM';
  }else{
    return val;
  }
    
}

//Convert 12hrs time to 24hrs time 
convertTimeFormat(tm){
  if(tm != null){      
  var time = tm;
  var hrs = Number(time.match(/^(\d+)/)[1]);
  var mnts = Number(time.match(/:(\d+)/)[1]);
  var format = time.match(/\s(.*)$/)[1];
  if (format == "PM" && hrs < 12) hrs = hrs + 12;
  if (format == "AM" && hrs == 12) hrs = hrs - 12;
  var hours = hrs.toString();
  var minutes = mnts.toString();
  if (hrs < 10) hours = "0" + hours;
  if (mnts < 10) minutes = "0" + minutes;
   return hours;
  }else{
    return 0;
  }
}

 //Convert Date formate
 dtConv(dt){
  var date = new Date(dt);
  return ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear();
}


dtConv2(dt){
  var date = new Date(dt);
  return  date.getFullYear() +'-'+ ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate()));
}

checkstatus(evt){
  let target = evt.target;
  if (target.checked) {
    this.status = "Y";
  } else {
    this.status = "N";
  }
}

 //Store Holidays grid
 getStoreHolidaysList(){
  const objholiday = {
    "Dh_id":"0",
    "expression":""
    }

  this.ApiService.getStoreHolidays(objholiday).subscribe(
    data => {
        console.log("Holidays List :", data);
        if(data['status'] == 200){
            this.holidaysList = data['response'];
            this.SpinnerService.hide();
        }else{
          this.SpinnerService.hide();
        }
    });
}

addHoliday(){
  this.action = 'A';
  this.AddEdit = true;
  this.StrHldyform.get("hldyName").setValue('');
  this.StrHldyform.get("frmDte").setValue('');
  this.StrHldyform.get("toDte").setValue('');
  this.StrHldyform.get("status").setValue('');
}

ShowUpdatePanel(obj){    
  this.action = 'U'; 
  this.AddEdit = true;
  this.hoursrecordd = obj;    
  console.log("update record", obj);
  this.StrHldyform.get("hldyName").setValue(obj.Dh_holiday_name);
  this.StrHldyform.get("frmDte").setValue(this.dtConv2(obj.Dh_start_date));
  this.StrHldyform.get("toDte").setValue(this.dtConv2(obj.Dh_end_date));
 this.StrHldyform.get("status").setValue(obj.Dh_status);
 this.status = obj.Dh_status;

}

Save(){
    
 // let CreatedUserId = localStorage.getItem("uId");
 let CreatedUserId ="2009";
 this.submitted = true;
 console.log(this.StrHldyform);
 if(this.StrHldyform.invalid){
   console.log("invalid");
   return;
 }
 const formValue = this.StrHldyform.value;
console.log('formValue',formValue);
 let holidaydata;
 if(this.action == 'A'){
  
     holidaydata ={
    //  "action":this.action,      
      "Dh_Dealer_id":"qwerty",
      "Dh_holiday_name": formValue.hldyName,
      "Dh_start_date":formValue.frmDte,
      "Dh_end_date":formValue.toDte,
      "Dh_CreatedUserId":CreatedUserId        
    }
    this.ApiService.postmethod('dealerholidays',holidaydata).subscribe((data:any)=>{
      console.log(data);
      if(data.message == "success"){         
         this.showdata = true;
         this.AddEdit = false; 
        this.getStoreHolidaysList();
        $(".modal-backdrop").remove();
        this.alertify.success(data.response);
      }
    },  
   (error) => {
    console.log(error);
  });

}else if(this.action == 'U'){
  holidaydata ={
   // "action":this.action,      
    "Dh_Dealer_id":"qwerty",
    "Dh_holiday_name": formValue.hldyName,
    "Dh_start_date":formValue.frmDte,
    "Dh_end_date":formValue.toDte,
    "Dh_CreatedUserId":CreatedUserId,   
    "Dh_id": this.hoursrecordd.Dh_id,
    "Dh_status":this.status,
  }
  this.ApiService.putmethod('dealerholidays',holidaydata).subscribe((data:any)=>{
    console.log(data);
    if(data.message == "success"){       
      this.showdata = true;
      this.AddEdit = false; 
      this.getStoreHolidaysList();
      $(".modal-backdrop").remove();
      this.alertify.success(data.response);
    }
  },  
 (error) => {
  console.log(error);
});
  
}


}


}
