
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApiService } from '../../_services/api.service';
import { AddUserComponent } from '../user/add-user/add-user.component';
import { PopupComponent } from '../popup/popup.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminServiceService } from '../../_services/admin-service.service';


@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.scss']
})
export class AddGroupComponent implements OnInit {

  dshipForm: FormGroup;
  popupForm: FormGroup;
  submitted = false;
  contactSubmit = false;
  address: any;
  adr1: any;
  adr2: any;
  // quantities1: any;
  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  uploadedFileName: any;
  finalObjData: any = {
    dgname: '',
    dgaddress1: '',
    dgaddress2: '',
    dgaddress3: '',
    dgcity: '',
    dgstate: 1,
    dgcountry: 4,
    dgzip: '',
    dgphone: '',
    dgstatus: 'A',
    dgcreateduser: 1001,
    dgupdateduser: 2001,
    dealergroupdetails: []
  };
  contactformShow: Boolean = false;

  constructor(private fB: FormBuilder, private dataServ: ApiService, private router: Router, public dialog: MatDialog) {
    this.dshipForm = this.fB.group({
      dship: ['', [Validators.required, Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*')]],
      address: ['', [Validators.required, Validators.maxLength(1000)]],
      quantities: this.fB.array([]),
      dcity: ['', [Validators.required, Validators.maxLength(50)]],
      state: ['', [Validators.required]],
      zip: ['', [Validators.required, Validators.maxLength(6)]],
      country: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      fileUpload: ['', [Validators.required]],
      avatar: [null]
    });
    this.popupForm = this.fB.group({
      user: ['', [Validators.required, Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*')]],
      position: ['', [Validators.required]],
      email: ['', [Validators.required]],
      userphone: ['', [Validators.required]],
      contact: ['', [Validators.required, Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*')]],
      contposition: ['', [Validators.required]],
      contemail: ['', [Validators.required]],
      contphone: ['', [Validators.required]],
      dgContacts: this.fB.array([]),
      dgUsers: this.fB.array([])
    });
  }

  get f() { return this.dshipForm.controls; }
  get f1() { return this.popupForm.controls; }

  ngOnInit(): void {
  }

  onSubmit() {
    this.submitted = true;
    if (this.dshipForm.invalid) {
      return;
    }
    console.log('form values :', this.dshipForm.value);
    console.log('DshipVal :', this.dshipForm.value.dship);
    const fd: any = new FormData();
    if (this.dshipForm.value.quantities.length > 0) {
      this.adr1 = this.dshipForm.value.quantities[0].address1;

      this.adr2 = this.dshipForm.value.quantities[1].address1;
      this.finalObjData.dgaddress2 = this.adr1;
      this.finalObjData.dgaddress3 = this.adr2;
    } else {
      this.finalObjData.dgaddress2 = '';
      this.finalObjData.dgaddress3 = '';
    }

    this.finalObjData.dgname = this.dshipForm.value.dship;
    this.finalObjData.dgaddress1 = this.dshipForm.value.address;
    this.finalObjData.dgcity = this.dshipForm.value.dcity;
    this.finalObjData.dgstate = 1;
    this.finalObjData.dgcountry = 4;
    this.finalObjData.dgzip = this.dshipForm.value.zip;
    this.finalObjData.dgphone = this.dshipForm.value.phone;
    this.finalObjData.dgstatus = 'A';
    this.finalObjData.dgcreateduser = 1002;
    this.finalObjData.dgupdateduser = 1001;
    console.log('Fine Obj', this.finalObjData);

    fd.append('data', JSON.stringify(this.finalObjData));
    fd.append('file', this.dshipForm.get('avatar').value, this.uploadedFileName);
    console.log('Final Obj', fd);
    const options = { content: fd };
    this.dataServ.postmethod('dealershipgroups', fd).subscribe((resp: any) => {
      console.log('Post Resp:', resp);
      console.log('res', resp.status);
      if (resp.status == 200) {

        alert('data Added Succefully');
        this.router.navigate(['/Dashboard']);
      }
      // else
      // alert("Undefined")
    },
    );
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
    else if (this.dshipForm.get('address').value === '') {
      alert('Address 1 is empty..!');
    } else {
      if (this.dshipForm.get('quantities')['controls'][0]) {
        const qlen = this.dshipForm.get('quantities')['controls'].length;

        if (qlen >= 1 && qlen < 2) {
          if (this.dshipForm.get('quantities')['controls'][qlen - 1].value.address1 === '') {
            alert('Address 2 is empty..!');
            // alert('Address 2' + qlen + ' is empty..!');
            return false;
          } else {
            this.quantities().push(this.newQuantity());
          }
        }
      }
    }

    //  console.log(this.fB);
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

  // showContact() {
  //   this.contactformShow != this.contactformShow;
  // }

  // openDialog(): void {
  //   const dialogRef = this.dialog.open(PopupComponent, {
  //     width: '100%',
  //     // data: {name: this.name, animal: this.animal}
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     const resp = JSON.parse(`${result}`);
  //     console.log('Dialog result:', resp);

  //     for (let i in resp.contacts) {
  //       this.finalObjData.dealergroupdetails.push(resp.contacts[i]);
  //     }

  //     for (let y in resp.users) {
  //       this.finalObjData.dealergroupdetails.push(resp.users[y]);
  //     }
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

  uploadFile() {
    // const formData = new FormData();
    // formData.append('file', this.fileData);
    // this.http.post('url/to/your/api', formData)
    //   .subscribe(res => {
    //     console.log(res);
    //     this.uploadedFilePath = res.data.filePath;
    //     alert('SUCCESS !!');
    //   })
  }

  addUser(): void {
    console.log('adduser');
    this.contactSubmit = true;
    if (this.popupForm.invalid) {
      return;
    }
    else {
      (<FormArray>this.popupForm.get('dgUsers')).push(this.addUserFormGroup());
    }
  }

  addContact(): void {
    console.log('addcontact');
    this.contactSubmit = true;
    if (this.popupForm.invalid) {
      return;
    }
    else {
      (<FormArray>this.popupForm.get('dgContacts')).push(this.addContactFormGroup());
    }
  }

  saveContact() {
    console.log('contacts and users', this.popupForm.controls);
    const dguserObj = [{
      dgdname: this.popupForm.value.user,
      dgdposition: 1,
      dgdemail: this.popupForm.value.email,
      dgdphone: this.popupForm.value.userphone,
      dgdtype: 'U',
      dgdstatus: 'A',
      dgdcreateduser: '1002',
      dgdupdateduser: '1003'
    }];

    const dgcontactobj = [{
      dgdname: this.popupForm.value.contact,
      dgdposition: 1,
      dgdemail: this.popupForm.value.contemail,
      dgdphone: this.popupForm.value.contphone,
      dgdtype: 'C',
      dgdstatus: 'A',
      dgdcreateduser: '1002',
      dgdupdateduser: '1003'
    }];
    const contactObj = this.popupForm.get('dgContacts').value;

    const usersObj = this.popupForm.get('dgUsers').value;

    for (let x of usersObj) {
      const subObj = {
        dgdname: x.user1,
        dgdposition: x.position1,
        dgdemail: x.email1,
        dgdphone: x.phone1,
        dgdtype: 'U',
        dgdstatus: 'A',
        dgdcreateduser: '1002',
        dgdupdateduser: '1003'
      };

      dguserObj.push(subObj);
    }

    for (let y of contactObj) {
      const csubObj = {
        dgdname: y.contact2,
        dgdposition: y.contposition2,
        dgdemail: y.contemail2,
        dgdphone: y.contphone2,
        dgdtype: 'C',
        dgdstatus: 'A',
        dgdcreateduser: '1002',
        dgdupdateduser: '1003'
      };

      dgcontactobj.push(csubObj);
    }

    const mainObj = {
      users: dguserObj,
      contacts: dgcontactobj
    };

    console.log('Final Obj', mainObj);

    // const req = JSON.stringify(mainObj);
    for (let i in mainObj.contacts) {
      this.finalObjData.dealergroupdetails.push(mainObj.contacts[i]);
    }

    for (let y in mainObj.users) {
      this.finalObjData.dealergroupdetails.push(mainObj.users[y]);
    }
    this.contactformShow = false;
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
}
