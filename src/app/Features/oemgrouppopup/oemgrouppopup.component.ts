import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder, Validators} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService} from '../../Core/_providers/api-service/api.service'

@Component({
  selector: 'app-oemgrouppopup',
  templateUrl: './oemgrouppopup.component.html',
  styleUrls: ['./oemgrouppopup.component.scss']
})
export class OemgrouppopupComponent implements OnInit {

  oemgrouppopupForm:FormGroup;
  submitted:boolean;
  fileData: File = null;
  selectedFile:any='';
  file: File;
  fileName: string = "";
  phoneFormat: any[] = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  statesData: any=[];

  constructor(private fB: FormBuilder, private ApiService: ApiService,public dialog: MatDialog) { 
    this.oemgrouppopupForm=this.fB.group({

      oemgroupname : ['',[Validators.required, Validators.maxLength(50)]],
      oemaddress1 :[''],
      oemaddress2 :[''],
      oemcity :[''],
      oemstate :[''],
      oemcountry :[''],
      oemzip :[''],
      oemphone :[''],
      
      file :['']
 
    });
  }

  ngOnInit(): void {
    this.getStates();
  }
  processFile(element:any){
    this.fileData= <File>element.target.files[0];
    this.preview();
  }
  preview() {
    // Show preview 
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
 
    var reader = new FileReader();      
    reader.readAsDataURL(this.fileData); 
    reader.onload = (_event) => { 
      this.selectedFile = reader.result; 
    }
   }
   getStates(){
    this.ApiService.getStates('states?185').subscribe((res:any)=>{
     if(res.status = 200)
       this.statesData=res.response;

    });
  }
  onkeyPress(event:any){
    const pattern = /[0-9+( )-]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

   OnGroupSubmit(){
    this.submitted = true;
    if (this.oemgrouppopupForm.invalid) {
      return
    }
    
    const formdata:any = new FormData();
    
    const obj = {
      oemid: 0,
     
      oemname: this.oemgrouppopupForm.value.oemgroupname,
      oembrands :'',
      oemaddress1 : this.oemgrouppopupForm.value.oemaddress1,
      oemaddress2 : this.oemgrouppopupForm.value.oemaddress2,
      oemcit:this.oemgrouppopupForm.value.oemcity,
      oemstate : this.oemgrouppopupForm.value.oemstate,
      oemcountry : this.oemgrouppopupForm.value.oemcountry,
      oemzip : this.oemgrouppopupForm.value.oemzip,
      oemphone : this.oemgrouppopupForm.value.oemphone,
      oemcontact : [],
    
      oemstatus: "Y"
    };
   
   if (this.selectedFile == ''){
    formdata.append('data', JSON.stringify(obj));
   
      formdata.append('file', '');
    }
     else if (this.selectedFile){
      formdata.append('data', JSON.stringify(obj));
     
        formdata.append('file', this.file,this.fileName);
      }
    
      this.ApiService.postmethod('OEMGroups',formdata).subscribe((response:any)=>{
        console.log(response);
        if(response.status == 200){
          this.dialog.closeAll();
        }
      },
      );
   }
   closeBrand(){
    this.dialog.closeAll();
   }


}
