import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ApiService } from '../../_services/api.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  popupForm: FormGroup;
  submitted = false;
  // user: any;
  // position: any;
  // email: any;
  // phone: any;

  constructor(private fB: FormBuilder, private dataServ: ApiService, public dialogRef: MatDialogRef<PopupComponent>) {
    this.popupForm = this.fB.group({
      user: ['', [Validators.required, Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*')]],
      position: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      contact: ['', [Validators.required, Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*')]],
      contposition: ['', [Validators.required]],
      contemail: ['', [Validators.required]],
      contphone: ['', [Validators.required]],
      quantities: this.fB.array([]),
      dgContacts: this.fB.array([])

      // quantities: this.fB.array([this.newQuantity()])
    });

    // for (let i = 0; i <= 1; i++) {
    //   this.quantities().push(this.newQuantity());
    // }

    console.log('Quantities', this.quantities);
    console.log('Popupforms', this.popupForm);
  }

  get f() { return this.popupForm.controls; }

  ngOnInit(): void {
  }


  addUser(): void {
    console.log('adduser');
    this.submitted = true;
    if (this.popupForm.invalid) {
      return;
    }
    else {
      // this.quantities().push(this.newQuantity());
      (<FormArray>this.popupForm.get('quantities')).push(this.addUserFormGroup());
    }
  }

  addContact(): void {
    console.log('addcontact');
    this.submitted = true;
    if (this.popupForm.invalid) {
      return;
    }
    else {
      (<FormArray>this.popupForm.get('dgContacts')).push(this.addContactFormGroup());
    }
  }

  postUser() {
    const dguserObj = [{
      dgdname: this.popupForm.value.user,
      dgdposition: 1,
      dgdemail: this.popupForm.value.email,
      dgdphone: this.popupForm.value.phone,
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

    const usersObj = this.popupForm.get('quantities').value;

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
      users : dguserObj,
      contacts : dgcontactobj
    };

    console.log('Final Obj', mainObj);

    const req = JSON.stringify(mainObj);
    this.dialogRef.close(req);
    // this.dataServ.addUsers(mainObj).subscribe((resp: any) => {
    //   console.log('Post User:', resp);
    //   if (resp.status == 200) {
    //   }
    // });
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

  quantities(): FormArray {
    return this.popupForm.get('quantities') as FormArray;
  }

  // newQuantity(): FormGroup {
  //   return this.fB.group({
  //     user: '',
  //     position: '',
  //     email: '',
  //     phone: ''
  //   });
  // }

  remove(i: number) {
    this.quantities().removeAt(i);
  }


  dgContacts(): FormArray {
    return this.popupForm.get('dgContacts') as FormArray;
  }



  contRemove(i: number) {
    this.dgContacts().removeAt(i);
  }

  allowNumbers(event: any) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
