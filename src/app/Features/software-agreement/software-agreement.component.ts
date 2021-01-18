import { Component, OnInit ,ViewChild,AfterViewInit,ElementRef,Renderer2} from '@angular/core';
import { FormBuilder, FormGroup,ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from'../../Core/_providers/api-service/api.service';
//import SignaturePad from 'signature_pad';

@Component({
  selector: 'app-software-agreement',
  templateUrl: './software-agreement.component.html',
  styleUrls: ['./software-agreement.component.scss']
})
export class SoftwareAgreementComponent implements OnInit,AfterViewInit {
  @ViewChild('ceoPad', {static: true}) signaturePadElement;
  @ViewChild('custPad',{static:true}) signaturePadElements;
  ceosignaturePad: any;
  custsignaturePad:any;
  SoftwareForm: FormGroup;
  submitted = false;
  contactId: string;
  ContactDetails: any=[];
  BrandsList: any=[];
  brandnames: any=[];
  brands: any;
  constructor(private formBuilder: FormBuilder,private renderer: Renderer2, private apiservice : ApiService) {
    this.SoftwareForm = this.formBuilder.group({
      txtAgreementDate: [''],
      txtServiceorInvoiceDate: [''],
     // ceoPad: ['',],
      chkterms: ['']
    });
   }

  ngOnInit(): void {
    this.contactId= localStorage.getItem('contactId');
    this.GetContractFormDetails(this.contactId);
  }

  ngAfterViewInit(): void {
    //this.ceosignaturePad = new SignaturePad(this.signaturePadElement.nativeElement);
    //this.custsignaturePad = new SignaturePad(this.signaturePadElements.nativeElement);
  }

   GetContractFormDetails(id){
    
    this.ContactDetails =[];
    const obj={'id':id}
     this.apiservice.getContractForm(obj).subscribe((res:any)=>{
         if(res.status == 200){
           this.ContactDetails = res.response[0];
           if(this.ContactDetails.dsc_brands.indexOf(',') > -1){
              this.BrandsList = this.ContactDetails.brandnames.split(',');
              for(var i in this.BrandsList){
                this.brandnames +=(this.BrandsList[i].split('_')[1])+',';
              }
              this.brands = this.brandnames.slice(0,-1);
           }
           else
           this.brandnames.push(this.ContactDetails.brandnames.split('_')[1]);
           console.log(this.ContactDetails);
         }
     });
   }

  first(){
    try {
  const errorField = this.renderer.selectRootElement('.divforscrollingtop');
    errorField.scrollIntoView();
} catch (err) {

}
}


  download(dataURL, filename) {
    if (navigator.userAgent.indexOf('Safari') > -1 && navigator.userAgent.indexOf('Chrome') === -1) {
      window.open(dataURL);
    } else {
      const blob = this.dataURLToBlob(dataURL);
      return blob;
     // const url = window.URL.createObjectURL(blob);
     // const a = document.createElement('a');
     // a.href = url;
    //  a.download = filename;

     // document.body.appendChild(a);
     // a.click();

     // window.URL.revokeObjectURL(url);

    //  const data = this.signaturePad.toData();
    // if (data) {
    //   data.pop(); // remove the last dot or line
    //   this.signaturePad.fromData(data);
    // }
    }
  }

  dataURLToBlob(dataURL) {
    // Code taken from https://github.com/ebidel/filer.js
    const parts = dataURL.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
  }

  

  onSubmit(){
    this.submitted = true;
    if (this.SoftwareForm.invalid) {
      return;
    }
    const fd:any = new FormData();
    if (this.ceosignaturePad.isEmpty()) {
      alert('Please provide a ceo signature first.');
    } else {
     const dataURL = this.ceosignaturePad.toDataURL();
     const ceosignature=  this.download(dataURL, 'signature.png');
     console.log(ceosignature);
     fd.append('file',ceosignature);
    }
    if(this.custsignaturePad.isEmpty()){
      alert('Please provide a customer signature first.');
    }else{
      const dataURL1 = this.custsignaturePad.toDataURL();
      const custsignature=  this.download(dataURL1, 'signature.png');
      console.log(custsignature);
      fd.append('file',custsignature);
    }
  }

  ClearCeoSign(){
    this.ceosignaturePad.clear();
  }

  ClearCustSign(){
this.custsignaturePad.clear();
  }
 
}
