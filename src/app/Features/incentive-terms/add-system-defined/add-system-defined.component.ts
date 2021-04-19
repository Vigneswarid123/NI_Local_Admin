import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../Core/_providers/api-service/api.service';
import { FormControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import xml2js from 'xml2js'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertifyService } from '../../../Core/_providers/alert-service/alertify.service';


@Component({
  selector: 'app-add-system-defined',
  templateUrl: './add-system-defined.component.html',
  styleUrls: ['./add-system-defined.component.scss']
})
export class AddSystemDefinedComponent implements OnInit {

  addTermForm: FormGroup;
  submitted = false;
  public globalResponse: any = [];
  showOptions: any;
  switchResult : any = 'N';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private termSrvc: ApiService,
    private _http: HttpClient,
    private alertify: AlertifyService
    ) { }

  ngOnInit(): void {
    this.loadXML();
    this.addTermForm = this.formBuilder.group({
      itc_Name: ['', [Validators.required, Validators.maxLength(50)]],
      itc_Type: ['', [Validators.required, Validators.min(1)]],
      itc_DisplayName: ['', [Validators.required, Validators.maxLength(50)]],
      itc_Description: ['', [Validators.required, Validators.maxLength(100)]],
      itc_Status: ['Y', [Validators.required]] ,
     incentivetermsoptions: this.formBuilder.array([]),
     itc_IsDealerSpecific : [this.switchResult],
     itc_Reference : ['', [Validators.required, Validators.maxLength(50)]],
     itc_Frequency: ['', [Validators.required, Validators.min(1)]]
      }); 
    console.log(this.addTermForm.value);

    this.addTermForm.get("itc_Type").valueChanges.subscribe((itc_Type) => { 
      if (itc_Type === '3' || itc_Type === '8') 
      {
        this.listItemsArray.clear();
        this.showOptions = true;
        this.addTermForm.get('incentivetermsoptions').enable();
        this.addGroup(); 
        this.switchResult = 'N'
      } 
      else
      {
        this.listItemsArray.clear(); 
        this.showOptions = false;
        this.addTermForm.get('incentivetermsoptions').disable();
       // this.switchResult = 'N';
      }
  });

  }


  onSubmit()
  {
  this.submitted = true;
    if (this.addTermForm.invalid) {
      return;
    }

    console.log(this.addTermForm.value);
    this.termSrvc.postmethod('incentivetermsandconditions', this.addTermForm.value).subscribe((response:any)=>{
      this.globalResponse = response;
      console.log(response);
      if(this.globalResponse.status === 200)
      {
        this.alertify.success('Record added successfully');
        console.log(this.globalResponse)
        this.router.navigate(['incentiveTerms']);
      }

      else if (this.globalResponse.status === 401){
        this.alertify.error(this.globalResponse.error);
      }
 });
    
}

getDealerSpecificVal(e){
  if(e.target.checked == true)
  {
    this.addTermForm.controls["itc_IsDealerSpecific"].setValue('Y');
    this.switchResult='Y';
    this.showOptions = false;
    this.addTermForm.get('incentivetermsoptions').disable();
    console.log('checkedvalue', this.addTermForm.controls["itc_IsDealerSpecific"].value);
  }
  if(e.target.checked == false)
  {
    if (this.addTermForm.controls['itc_Type'].value === '1' || this.addTermForm.controls['itc_Type'].value === '2')
      {
        this.addTermForm.controls["itc_IsDealerSpecific"].setValue('N');
        this.switchResult = 'N';
        this.showOptions = false;
        this.addTermForm.get('incentivetermsoptions').disable();
      }
      if (this.addTermForm.controls['itc_Type'].value === '3' || this.addTermForm.controls['itc_Type'].value === '8')
      {
        this.addTermForm.controls["itc_IsDealerSpecific"].setValue('N');
        this.switchResult = 'N';
        this.showOptions = true;
        this.addTermForm.get('incentivetermsoptions').enable();
      }
  }
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


value = this.formBuilder.group({
  to_Name: ['', Validators.required],
  to_Status: ['Y', Validators.required],
});

get listItemsArray()
{
  return this.addTermForm.get('incentivetermsoptions') as FormArray;
}

addGroup()
 {
  if (this.listItemsArray.invalid)
  {
    this.alertify.error ('Please enter the empty fields..!')
     this.listItemsArray.updateValueAndValidity();
     return;
  }

  const val = this.formBuilder.group({
    to_Name: ['', Validators.required],
    to_Status: ['Y', Validators.required],
  });
  const form = this.addTermForm.get('incentivetermsoptions') as FormArray;
  form.push(val);
 }

 removeGroup(index) 
 {
  this.listItemsArray.removeAt(index);
 }


}
