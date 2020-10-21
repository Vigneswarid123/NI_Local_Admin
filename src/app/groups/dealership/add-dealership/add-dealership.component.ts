import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApiService } from '../../../_services/api.service';
import{ AddDealermodel }from '../../../_models/Adddealer';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminServiceService } from '../../../_services/admin-service.service';

@Component({
  selector: 'app-add-dealership',
  templateUrl: './add-dealership.component.html',
  styleUrls: ['./add-dealership.component.scss']
})
export class AddDealershipComponent implements OnInit {
  
    dealername:string;
    dealeraddress1:string;
    dealeraddress2:string; 
    dealeraddress3:string; 
    dealercity:string; 
    dealerstate:string; 
    dealercountry:string;
    dealerphone: string;
    dealerlogo: string; 
    dealerbrands:string; 
    dealerstatus: string;
    dealercreateduser:string;
    Getpositions:any
    dshipForm: FormGroup;
    submitted = false;
    contactSubmit =false;
    address: any 
    address1: any;
    address2: any;
    previewUrl: any = null;
    fileUploadProgress: string = null;
    uploadedFilePath: string = null;
    uploadedFileName: any;
    fileData: File = null;
    finalObjData: any = {
      dealername: '',
      dealeraddress1: '',
      dealeraddress2: '',
      dealeraddress3: '',
      dealercity: '',
      dealerstate: '',
      dealercountry: '',
      dealerzip: '',
      dealerphone: '',
      dealerstatus: 'A',
      dealerbrands:'',
      dealerlogo:'',
      dealergroupid: 3053,
      dealercreateduser: 1001,
      dealerdetails: []
    };
    //user details
    showDiv: Boolean =  false
    popupForm: FormGroup;
    // showDiv: Boolean = false;
    constructor(private fB: FormBuilder,private authService: ApiService, private router: Router, public dialog: MatDialog, private adminService:AdminServiceService){
      this.dshipForm = this.fB.group({
        dship: ['', [Validators.required, Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*')]],
        address: ['', [Validators.required, Validators.maxLength(50)]],
        quantities: this.fB.array([]),
        dcity: ['', [Validators.required, Validators.maxLength(50)]],
        state: ['', [Validators.required]],
        zip: ['', [Validators.required, Validators.maxLength(6)]],
        country: ['', [Validators.required]],
        phone: ['', [Validators.required]],
        brand: ['', [Validators.required]],
         fileUpload: ['', [Validators.required]],
        avatar: [null]
      });
       this.popupForm = this.fB.group({
      user: ['', [Validators.required, Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*')]],
      position: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      contact: ['', [Validators.required, Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*')]],
      contposition: ['', [Validators.required]],
      contemail: ['', [Validators.required]],
      contphone: ['', [Validators.required]],
      
      dgContacts: this.fB.array([]),
      dgUsers: this.fB.array([])

      // quantities: this.fB.array([this.newQuantity()])
    });
     }
  
     get f() { return this.dshipForm.controls; }
     get f1() { return this.popupForm.controls; }
    ngOnInit() {
      this.getpositions();
    }
  
    
    DealerAddOnSubmit() {
      this.submitted = true;
      if (this.dshipForm.invalid) {
        return;
    }
    const fd: any = new FormData();
    if (this.dshipForm.value.quantities.length > 0) {
      this.address1 = this.dshipForm.value.quantities[0].address1;
      this.address2 = this.dshipForm.value.quantities[1].address1;
      this.finalObjData.dealeraddress2 = this.address1;
      this.finalObjData.dealeraddress3 = this.address2;
    } else {
      this.finalObjData.dealeraddress2 = '';
      this.finalObjData.dealeraddress3 = '';
    }
    let Addealermodel = new AddDealermodel(
     this.finalObjData.dealername = this.dshipForm.value.dship,
     this.finalObjData.dealeraddress1 = this.dshipForm.value.address,
    //  this.finalObjData.dealeraddress2 = this.dshipForm.value.quantities[0].address1,
    //  this.finalObjData.dealeraddress3 = this.dshipForm.value.quantities[1].address1,
     this.finalObjData.dealercity = this.dshipForm.value.dcity,
     this.finalObjData.dealerstate = this.dshipForm.value.state,
     this.finalObjData.dealercountry = this.dshipForm.value.country,
     this.finalObjData.dealerzip = this.dshipForm.value.zip,
     this.finalObjData.dealerphone = this.dshipForm.value.phone,
     this.finalObjData.dealerbrands = this.dshipForm.value.brand,
      
      );
      fd.append('data', JSON.stringify(this.finalObjData));
      fd.append('file', this.dshipForm.get('avatar').value, this.uploadedFileName);
      console.log('Final Obj', this.finalObjData);
      const options = { content: fd };
      this.adminService.postmethod('dealerships',fd).subscribe((response:any)=>{
        console.log(response);
        if(response.status == 200){
          alert("Record inserted successfully");
            console.log(response);
            this.router.navigate(['DealershipsDetails']); 
        }
      },
     (error) => {
      console.log('error',error);
    });
  }
  
 
  quantities(): FormArray {
    return this.dshipForm.get('quantities') as FormArray;
  }
  dgContacts(): FormArray {
    return this.popupForm.get('dgContacts') as FormArray;
  }

  dgUsers(): FormArray {
    return this.popupForm.get('dgUsers') as FormArray;
  }
  
  newQuantity(): FormGroup {
    return this.fB.group({
     address1: ''
    });
  }
  AddInput() {
    console.log(this.dshipForm.get('quantities')['controls']);
    
    // tslint:disable-next-line:align
    if (this.dshipForm.get('address').value !== '' && !this.dshipForm.get('quantities')['controls'][0]) {
    this.quantities().push(this.newQuantity());
    }
    else if (this.dshipForm.get('address').value === ''){
    alert('Address 1 is empty..!');
    }else{
    if (this.dshipForm.get('quantities')['controls'][0]){
    const qlen = this.dshipForm.get('quantities')['controls'].length;
    
    if (qlen >= 1 && qlen < 2){
    if (this.dshipForm.get('quantities')['controls'][qlen - 1].value.address1 === ''){
    alert('Address 2 is empty..!');
    return false;
    }else{
    this.quantities().push(this.newQuantity());
    }
    }
    }
    }
   }
   remove(i: number) {
    this.quantities().removeAt(i);
  }

  contRemove(i: number) {
    this.dgContacts().removeAt(i);
  } 

  userRemove(i: number) {
    this.dgUsers().removeAt(i);
  }
  
  _keyPress(event: any) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  
  allowNumbers(event: any) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  // openDialog(): void {
  //   const dialogRef = this.dialog.open(AddDealershipComponent, {
  //     width: '100%'
  //     // data: {name: this.name, animal: this.animal}
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     const resp = JSON.parse(`${result}`);
  //     console.log('Dialog result:', resp);

  //     for (let i in resp.contacts) {
  //       this.finalObjData.dealerdetails.push(resp.contacts[i]);
  //     }

  //     for (let y in resp.users) {
  //       this.finalObjData.dealerdetails.push(resp.users[y]);
  //     }
  //     // this.finalObjData.dealergroupdetails.push(resp.contacts);
  //     // this.finalObjData.dealergroupdetails.push(resp.users);
  //   });
  // }
  public fileProgress(fileInput: any): void {
    this.fileData = <File>fileInput.target.files[0];
    this.uploadedFileName = <File>fileInput.target.files[0].name;
    console.log('file upload', this.uploadedFileName);

    const file = (fileInput.target as HTMLInputElement).files[0];
    this.dshipForm.patchValue({
      avatar: file
    });

    this.dshipForm.get('avatar').updateValueAndValidity();

    this.preview();
  }
  public preview(): void {
    // Show preview
    const mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
    };
  }
  addUser(): void {
    console.log('adduser');
    this.submitted  = true;
    if (this.popupForm.invalid) {
      return;
    }
    else {
      (<FormArray>this.popupForm.get('dgUsers')).push(this.addUserFormGroup());
    }
  }

  addContact(): void {
    console.log('addcontact');
    this.submitted  = true;
    if (this.popupForm.invalid) {
      return;
    }
    else {
      (<FormArray>this.popupForm.get('dgContacts')).push(this.addContactFormGroup());
    }
  }

  postUser() {
    console.log('contacts and users', this.popupForm.controls);
    const dguserObj = [{
      ddname: this.popupForm.value.user,
      ddposition:  1,
      ddemail: this.popupForm.value.email,
      ddphone: this.popupForm.value.phone,
      ddtype: 'U',
      ddstatus: 'A',
      ddcreateduser: '1002',
      ddupdateduser: '1003'
    }];

    const dgcontactobj = [{
      ddname: this.popupForm.value.contact,
      ddposition:  1,
      ddemail: this.popupForm.value.contemail,
      ddphone: this.popupForm.value.contphone,
      ddtype: 'C',
      ddstatus: 'A',
      ddcreateduser: '1002',
      ddupdateduser: '1003'
    }];
    const contactObj = this.popupForm.get('dgContacts').value;

    const usersObj = this.popupForm.get('dgUsers').value;

    for (let x of usersObj) {
      const subObj = {
        ddname: x.user1,
        ddposition: x.position1,
        ddemail: x.email1,
        ddphone: x.phone1,
        ddtype: 'U',
        ddstatus: 'A',
        ddcreateduser: '1002',
        ddupdateduser: '1003'
      };

      dguserObj.push(subObj);
    }

    for (let y of contactObj) {
      const csubObj = {
        ddname: y.contact2,
        ddposition: y.contposition2,
        ddemail: y.contemail2,
        ddphone: y.contphone2,
        ddtype: 'C',
        ddstatus: 'A',
        ddcreateduser: '1002',
        ddupdateduser: '1003'
      };

      dgcontactobj.push(csubObj);
    }

    const mainObj = {
      users: dguserObj,
      contacts: dgcontactobj
    };

    console.log('Final Obj', mainObj);

    // const req = JSON.stringify(mainObj);
    //  this.dialogRef.close(req);
    // const finalreq = JSON.parse(req);
    
    for (let i in mainObj.contacts) {
      this.finalObjData.dealerdetails.push(mainObj.contacts[i]);
    }

    for (let y in mainObj.users) {
      this.finalObjData.dealerdetails.push(mainObj.users[y]);
    }
    this.showDiv = false;
    
   
  }

  addUserFormGroup(): FormGroup {
    console.log('I am in addduSer Form group');
    return this.fB.group({
      user1: ['', [Validators.required, Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*')]],
      position1: ['', [Validators.required]],
      email1: ['', [Validators.required]],
      phone1: ['', [Validators.required]],
    });
  }

  addContactFormGroup(): FormGroup {
    console.log('I am in addContact Form group');
    return this.fB.group({
      contact2: ['', [Validators.required, Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*')]],
      contposition2: ['', [Validators.required]],
      contemail2: ['', [Validators.required]],
      contphone2: ['', [Validators.required]],
    });
  }
  getpositions() {
    
    const obj = {
      "p_id": 0
      };
     
      this.adminService.postmethod('positions/GET', obj).subscribe(
        response => {
          console.log('Getposition', response.response);
          this.Getpositions =  response.response;
    });
  }
  }
