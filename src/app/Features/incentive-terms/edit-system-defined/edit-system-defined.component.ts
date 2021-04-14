import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../Core/_providers/api-service/api.service';
import { FormControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import xml2js from 'xml2js'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertifyService } from '../../../Core/_providers/alert-service/alertify.service';

@Component({
selector: 'app-edit-system-defined',
templateUrl: './edit-system-defined.component.html',
styleUrls: ['./edit-system-defined.component.scss']
})

export class EditSystemDefinedComponent implements OnInit {

addTermForm: FormGroup;
submitted = false;
loading = false;
public globalResponse1: any = [];
public globalResponse2: any = [];
showOptions: any;
id: number;
getTermDetailsArray: any = [];
getTermOptionsArray: any = [];
MIT_ID:number
finalObjData: any = {
action:'',
itc_Id : '',
itc_Name : '',
itc_Type : '',
itc_DisplayName: '',
itc_Description: '',
itc_Status : '',
itc_IsDealerSpecific:'N',
itc_Reference:'',
itc_Frequency: '',
incentivetermsoptions: [{}]
};

switchResult: any;
constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private termSrvc: ApiService,
    private _http: HttpClient,
    private alertify: AlertifyService
    ) 
    { 
      this.route.queryParams.subscribe(params => {
        this.MIT_ID = params.MIT_ID;
        console.log(this.MIT_ID);
   });
    }


ngOnInit(): void {
    this.loadXML();
      
    this.addTermForm = this.formBuilder.group({
      MIT_NAME: ['', [Validators.required, Validators.maxLength(50)]],
      MIT_TYPE: ['', [Validators.required, Validators.min(1)]],
      MIT_DISPLAYNAME: ['', [Validators.required, Validators.maxLength(50)]],
      MIT_DESCRIPTION: ['', [Validators.required, Validators.maxLength(100)]],
      MIT_STATUS: ['', [Validators.required]] ,
      incentivetermsoptions: this.formBuilder.array([]),
      MIT_ISDEALERSPECIFIC: [''],
      MIT_REFERENCE: ['', [Validators.required, Validators.maxLength(50)]],
      MIT_FREQUENCY: ['', [Validators.required, Validators.min(1)]]
      }); 
      this.getTermDetails();
    console.log(this.addTermForm.value);

    this.addTermForm.get("MIT_TYPE").valueChanges.subscribe((MIT_TYPE) => { 
      if (MIT_TYPE === '3' || MIT_TYPE === '8') 
      {
        this.getTermOptionDetails();
        this.showOptions = true;
        this.addTermForm.get('incentivetermsoptions').enable();
        this.switchResult = 'N';
      } 
      else
      {
      //  this.switchResult = 'N';
        this.showOptions = false;
        this.addTermForm.get('incentivetermsoptions').disable();
      }
  });
  }

  getDealerSpecificVal(e){
    if(e.target.checked == true)
    {
      this.addTermForm.controls["MIT_ISDEALERSPECIFIC"].setValue('Y');
      this.switchResult = 'Y';
      this.showOptions = false;
      this.addTermForm.get('incentivetermsoptions').disable();
    }
    else
    {
    this.addTermForm.controls["MIT_ISDEALERSPECIFIC"].setValue('N');
    this.switchResult = 'N';
    this.showOptions = true;
    this.addTermForm.get('incentivetermsoptions').enable();
    }

  }

   
getTermDetails(){
    const obj: any ={
      itc_Id: this.MIT_ID
    }
    this.termSrvc.postmethod('incentivetermsandconditions/get', obj).subscribe((response:any)=>{
    console.log('response', response);
    console.log('responsetype', response.response[0].MIT_TYPE);
    this.globalResponse1 = response;
    this.getTermDetailsArray = this.globalResponse1.response[0];
    this.switchResult= this.getTermDetailsArray.MIT_ISDEALERSPECIFIC;
    console.log('switchresult', this.switchResult);
    console.log('getTermDetailsArray', this.getTermDetailsArray); 
    console.log('Type' + this.getTermDetailsArray.MIT_TYPE);
    if (this.getTermDetailsArray.MIT_TYPE === 3 || this.getTermDetailsArray.MIT_TYPE === 8){
      this.getTermOptionDetails();
        this.showOptions = true;
        this.addTermForm.get('incentivetermsoptions').enable();
    }
    else{
      this.showOptions = false;
        this.addTermForm.get('incentivetermsoptions').disable();
    } 
    });

    }
    
    ​​​​​​​​
    optionsArray: any = [];

    getTermOptionDetails(){
      const obj: any ={
        TermID: this.MIT_ID
      }
      this.termSrvc.postmethod('termsandconditions/incentivetermoptions', obj).subscribe((res:any)=>{
      console.log('response:', res);
      this.optionsArray = res.response;
      console.log('optionsArray', this.optionsArray);
       const getTermArray=res.response;
       for(let T in getTermArray){
        (<FormArray>this.addTermForm.get('incentivetermsoptions')).push(this.value(getTermArray[T]));
       } 
       this.showOptions = true;
       this.addTermForm.get('incentivetermsoptions').enable();
      });
      
      }​​​​​​​​




      OnSubmit(){
        if ( this.addTermForm.controls['MIT_TYPE'].value === '3' || this.getTermDetailsArray.MIT_TYPE === 3
        || this.addTermForm.controls['MIT_TYPE'].value === '8' || this.getTermDetailsArray.MIT_TYPE === 8)
        {​​​​​​​​
      this.submitted = true;
      if (this.addTermForm.invalid) {​​​​​​​​
        this.alertify.error ('Please enter the empty fields..!');
      return;
          }​​​​​​​​
        this.finalObjData.incentivetermsoptions=[];
        this.finalObjData.action='U';
        this.finalObjData.itc_Id = this.MIT_ID;
        this.finalObjData.itc_Name = this.addTermForm.value.MIT_NAME;
        this.finalObjData.itc_Type = this.addTermForm.value.MIT_TYPE;
        this.finalObjData.itc_DisplayName = this.addTermForm.value.MIT_DISPLAYNAME;
        this.finalObjData.itc_Description = this.addTermForm.value.MIT_DESCRIPTION;
        this.finalObjData.itc_Status = this.addTermForm.value.MIT_STATUS;
        this.finalObjData.itc_IsDealerSpecific = this.switchResult;
        this.finalObjData.itc_Reference = this.addTermForm.value.MIT_REFERENCE;
        this.finalObjData.itc_Frequency = this.addTermForm.value.MIT_FREQUENCY;
        this.finalObjData.incentivetermsoptions= this.addTermForm.get('incentivetermsoptions').value;
          
      console.log('object1',this.finalObjData);
     this.termSrvc.putmethod('incentivetermsandconditions', this.finalObjData).subscribe((res:any)=>{​​​​​​​​
      if(res.status == 200){​​​​​​​​
        this.alertify.success('Record Updated Successfully');
      this.router.navigate(['incentiveTerms']);
        }​​​​​​​​
      }​​​​​​​​)
        }       ​​​​​​​​
      
      else
        {​​​​​​​​
       
      this.submitted = true;
      if (this.addTermForm.invalid) {​​​​​​​​
        this.alertify.error ('Please enter the empty fields..!');
      return;
          }​​​​​​​​
       
          this.finalObjData.action='U';
          this.finalObjData.itc_Id = this.MIT_ID;
          this.finalObjData.itc_Name = this.addTermForm.value.MIT_NAME;
          this.finalObjData.itc_Type = this.addTermForm.value.MIT_TYPE;
          this.finalObjData.itc_DisplayName = this.addTermForm.value.MIT_DISPLAYNAME;
          this.finalObjData.itc_Description = this.addTermForm.value.MIT_DESCRIPTION;
          this.finalObjData.itc_Status = this.addTermForm.value.MIT_STATUS;
          this.finalObjData.itc_IsDealerSpecific = this.switchResult;
          this.finalObjData.itc_Reference = this.addTermForm.value.MIT_REFERENCE;
          this.finalObjData.itc_Frequency = this.addTermForm.value.MIT_FREQUENCY;
          this.finalObjData.incentivetermsoptions= [{}];
         ​​​​​​​​       
      this.termSrvc.putmethod('incentivetermsandconditions', this.finalObjData).subscribe((res:any)=>{​​​​​​​​
      if(res.status == 200){​​​​​​​​
        this.alertify.success ('Record Updated Successfully');
      this.router.navigate(['incentiveTerms']);
        }​​​​​​​​
      }​​​​​​​​)
       
        }
        
      }


  
  value(dt) : FormGroup {
    return this.formBuilder.group({
      action: 'U',
      to_Id:[dt.to_id],
      to_Name: [dt.to_Name, Validators.required],
      to_Status:'Y',
     
    });
  };
  
  incentivetermsoptions(): FormArray {
    return this.addTermForm.get('incentivetermsoptions') as FormArray;
  }
  


  addGroup(){
    if (this.addTermForm.get('incentivetermsoptions').invalid) {
      this.alertify.error('Please enter the empty fields..!');
      return;
    }
    else {
      (<FormArray>this.addTermForm.get('incentivetermsoptions')).push(this.Addvalue());
    }
  }

  onChange(value)
  {
   if (value === '3' || value === '8')
   {
      this.switchResult = 'N';
       this.incentivetermsoptions().clear();
      (<FormArray>this.addTermForm.get('incentivetermsoptions')).push(this.Addvalue());
      this.addTermForm.controls["MIT_ISDEALERSPECIFIC"].setValue('N');
      console.log('checkboxvalue', this.addTermForm.controls["MIT_ISDEALERSPECIFIC"].value);
   }
   else
   {
    this.switchResult = 'N';
    this.showOptions = false;
    this.addTermForm.get('incentivetermsoptions').disable();   
  }
  }
  

  removeGroup(i: number) {
  let action=this.addTermForm.get('incentivetermsoptions').value[i].action = 'D';
  let toid= this.addTermForm.get('incentivetermsoptions').value[i].to_Id;
  this.incentivetermsoptions().removeAt(i);
  const obj={
    action:action,
    to_Id:toid
  };
  (<FormArray>this.addTermForm.get('incentivetermsoptions')).push(this.delete(obj));
  }

  Addvalue() : FormGroup {
    return this.formBuilder.group({
      action: 'A',
      to_Id:[0],
      to_Name: ['', Validators.required],
      to_Status:'Y',
     
    });
  };

  delete(dt):FormGroup{
    return this.formBuilder.group({
      action: [dt.action],
      to_Id:[dt.to_Id]
    });
  }


  public xmlItems: any;

  loadXML() {  
    console.log('loadxml')
    this._http.get('../../../assets/data.xml',  
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
            console.log('xmlItems:',  this.xmlItems)
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
  
}