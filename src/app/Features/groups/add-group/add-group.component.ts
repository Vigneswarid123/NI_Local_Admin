
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApiService } from '../../../Core/_providers/api-service/api.service';
import { PopupComponent } from '../popup/popup.component';
// import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminServiceService } from '../../../Core/_providers/admin-service/admin-service.service';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from '../../../Core/_providers/alert-service/alertify.service';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.scss']
})
export class AddGroupComponent implements OnInit {

  getdgroups: any;
  getstatesresp: any = [];
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
    dgstate: '',
    dgcountry: '',
    dgzip: '',
    dgphone: '',
    dgwebsiteaddress: '',
    dgstatus: 'Y',
    dgcreateduser: 1001,
    dgupdateduser: 2001,
    dealergroupdetails: [{}]
  };
  contactformShow: Boolean = false;
  staticDiv: Boolean = true;
  id: any = 0;
  phoneFormat: any[] = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  EditableLogo: any;

  public proimg: any = '';
  public showimg: Boolean = true;
  public showchangeimg: Boolean = false;
  public selectedFile: any = null;
  public imageChangedEvent: any = '';

  constructor(private fB: FormBuilder, private dataServ: ApiService, private router: Router,
    private adminServ: AdminServiceService, private alertify: AlertifyService, private activatedRoute: ActivatedRoute) {
    console.log('Var Sample', this.getdgroups);
    this.dshipForm = this.fB.group({
      dship: ['', [Validators.required, Validators.maxLength(1000), Validators.pattern('[a-zA-Z0-9 ]*')]],
      address: ['', [Validators.required, Validators.maxLength(1000)]],
      quantities: this.fB.array([]),
      dcity: ['', [Validators.required, Validators.maxLength(50)]],
      state: ['', [Validators.required]],
      zip: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      country: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      webaddress: ['', [Validators.required, Validators.maxLength(100)]],
      fileUpload: ['', [Validators.required]],
      avatar: [null]
    });

    this.getStatesData();
    this.id = this.activatedRoute.snapshot.params.id;

    this.popupForm = this.fB.group({
      dgContacts: this.fB.array([]),
      dgUsers: this.fB.array([])
    });

    if (this.id > 0 && this.id != '') {
      this.contactformShow = true;
      this.getDealershipData(this.id);
    } else {
      (<FormArray>this.popupForm.get('dgUsers')).push(this.addUserFormGroup());
      (<FormArray>this.popupForm.get('dgContacts')).push(this.addContactFormGroup());
    }

  }

  get f() { return this.dshipForm.controls; }
  get f1() { return this.popupForm.controls; }

  ngOnInit(): void {
  }

  onSubmit() {
    console.log('form submission');
    this.submitted = true;
    if (this.dshipForm.invalid) {
      return;
    }
    console.log('contacts', this.popupForm.get('dgContacts').value);
    console.log('users', this.popupForm.get('dgUsers').value);
    const contacts = this.popupForm.get('dgContacts').value;
    const users = this.popupForm.get('dgUsers').value;
    if (contacts[0] || users[0]) {
      if (contacts[0] ?.contact2 == '' && users[0] ?.user1 == '') {
        this.finalObjData.dealergroupdetails = [{}];
      }
    }

    console.log('form values :', this.dshipForm.value);
    console.log('DshipVal :', this.dshipForm.value.dship);
    const fd = new FormData();
    if (this.dshipForm.value.quantities.length > 0) {
      this.adr1 = this.dshipForm.value.quantities[0].address1;

      this.adr2 = this.dshipForm.value.quantities[1].address1;
      this.finalObjData.dgaddress2 = this.adr1;
      this.finalObjData.dgaddress3 = this.adr2;
    } else {
      this.finalObjData.dgaddress2 = '';
      this.finalObjData.dgaddress3 = '';
    }

    if (this.id > 0 && this.id != '') {
      this.finalObjData.dgid = this.id;
      // this.finalObjData.dglogo = this.EditableLogo;
      this.finalObjData.action = 'U';
      if (this.finalObjData.dealergroupdetails.length > 0) {
        // for (const x in this.finalObjData.dealergroupdetails) {
        //  this.finalObjData.dealergroupdetails[x].action = 'U';
        // }
      }
      else {
        this.finalObjData.dealergroupdetails = [{}];
      }
      // this.finalObjData.dealergroupdetails = [{}];
    }

    console.log('Contacts :', this.finalObjData.dealergroupdetails);
    // return;

    this.finalObjData.dgname = this.dshipForm.value.dship;
    this.finalObjData.dgaddress1 = this.dshipForm.value.address;
    this.finalObjData.dgcity = this.dshipForm.value.dcity;
    this.finalObjData.dgstate = this.dshipForm.value.state;
    this.finalObjData.dgcountry = this.dshipForm.value.country;
    this.finalObjData.dgzip = this.dshipForm.value.zip;
    this.finalObjData.dgphone = this.dshipForm.value.phone;
    this.finalObjData.dgwebsiteaddress = this.dshipForm.value.webaddress;
    this.finalObjData.dgstatus = 'Y';
    this.finalObjData.dgcreateduser = 1002;
    this.finalObjData.dgupdateduser = 1001;
    console.log('Final Obj service submit 1', this.finalObjData);


    if (this.id > 0 && this.id != '') {
      // console.log('1');
      console.log('user File 1 ', this.uploadedFileName);
      console.log('user File 2 ', this.EditableLogo);
      if (this.uploadedFileName != '' && this.uploadedFileName != undefined) {
        // console.log('2');
        fd.append('file', this.dshipForm.get('avatar').value, this.uploadedFileName);
      } else {
        // console.log('3');
        console.log(this.EditableLogo);
        this.finalObjData.dglogo = this.EditableLogo;
        fd.append('file', this.EditableLogo);
      }

    } else {
      // console.log('0');
      fd.append('file', this.dshipForm.get('avatar').value, this.uploadedFileName);
    }

    fd.append('data', JSON.stringify(this.finalObjData));
    // console.log(...fd);

    // console.log('Final Obj service obj 2', fd);
    const options = { content: fd };
    if (this.id > 0 && this.id != "") {
      this.dataServ.putmethod('dealershipgroups', fd).subscribe((resp: any) => {
        console.log('Post Resp:', resp);
        console.log('res', resp.status);
        if (resp.status == 200) {

          this.alertify.success('Dealer Group Updated Successfully');
          this.router.navigate(['/DealershipList/' + this.id]);
        }
        // else
        // alert("Undefined")
      });
    } else {
      this.dataServ.postmethod('dealershipgroups', fd).subscribe((resp: any) => {
        console.log('Post Resp:', resp);
        console.log('res', resp.status);
        if (resp.status == 200) {

          this.alertify.success('Dealer Group Added Successfully');
          this.router.navigate(['/dashboard']);
        }
        // else
        // alert("Undefined")
      });
    }

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
    this.popupForm.get('dgContacts').value[i].contaction = 'D';
    console.log(this.popupForm.get('dgContacts').value);
    // this.dgContacts().removeAt(i);

  }

  userRemove(i: number) {
    this.popupForm.get('dgUsers').value[i].action1 = 'D';
    console.log(this.popupForm.get('dgUsers').value);
    // this.dgUsers().removeAt(i);
  }

  _keyPress(event: any) {
    const pattern = /[0-9+( )-]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  // allowNumbers(event: any) {
  //   const pattern = /[0-9+( )-]/;
  //   const inputChar = String.fromCharCode(event.charCode);
  //   if (!pattern.test(inputChar)) {
  //     event.preventDefault();
  //   }
  // }

  // showContact() {
  //   this.contactformShow != this.contactformShow;
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

  // Adding User
  addUser(): void {
    console.log('adduser');
    this.contactSubmit = true;
    if (this.popupForm.get('dgUsers').invalid) {
      alert('Please enter the empty fields..!');
      return;
    }
    else {
      (<FormArray>this.popupForm.get('dgUsers')).push(this.addUserFormGroup());
    }
  }

  // Adding Contact
  addContact(): void {
    console.log('addcontact');
    this.contactSubmit = true;
    console.log('contacts', this.popupForm.get('dgContacts').value);
    if (this.popupForm.get('dgContacts').invalid) {
      alert('Please enter the empty fields..!');
      return;
    }
    else {
      (<FormArray>this.popupForm.get('dgContacts')).push(this.addContactFormGroup());
    }
  }

  // checkProperties(obj) {
  //   console.log('Obj ', obj);


  // }

  // Save Contact and User in Array
  saveContact() {
    console.log('contacts and users', this.popupForm.controls);

    this.finalObjData.dealergroupdetails = [];

    const dguserObj = [];

    const dgcontactobj = [];

    const contactObj = this.popupForm.get('dgContacts').value;

    const usersObj = this.popupForm.get('dgUsers').value;


    console.log('save contact', contactObj);
    console.log('save user', usersObj);

    for (let x of usersObj) {
      var emptyCount = 0;
      for (const key in x) {
        if ((x[key] == null || x[key] === '') && key !== 'action1' && key !== 'dgd_id1') {
          emptyCount = emptyCount + 1;
        }
      }
      if (emptyCount < 4 && emptyCount !== 0) {
        alert('Please enter all User fields..!');
        return false;
      }


      const subObj = {
        action: x.action1,
        dgdid: x.dgd_id1,
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
      // }
    }

    for (let y of contactObj) {
      var emptyCount = 0;
      for (const key in y) {
        if ((y[key] == null || y[key] === '') && key !== 'action1' && key !== 'dgd_id1') {
          emptyCount = emptyCount + 1;
        }
      }
      if (emptyCount < 4 && emptyCount !== 0) {
        alert('Please enter all Contact fields..!');
        return false;
      }

      const csubObj = {
        action: y.contaction,
        dgdid: y.contdgd_id,
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
      // }
    }

    const mainObj = {
      users: dguserObj,
      contacts: dgcontactobj
    };

    console.log('Final Obj', mainObj);

    // const req = JSON.stringify(mainObj);
    for (let i in mainObj.contacts) {
      // if (mainObj.contacts[i].contact2 != "") {
      this.finalObjData.dealergroupdetails.push(mainObj.contacts[i]);
      // }
    }

    for (let y in mainObj.users) {
      // if (mainObj.users[y].user1 != "") {
      this.finalObjData.dealergroupdetails.push(mainObj.users[y]);
      // }
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
      dgd_id1: [0],
      action1: ['A']
    });
  }

  addUserFormGroup2(dt): FormGroup {
    console.log('I am in addduSer Edit group', dt);
    return this.fB.group({
      user1: [dt.dgd_name, [Validators.required, Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*')]],
      position1: [dt.dgd_position, [Validators.required]],
      email1: [dt.dgd_email, [Validators.required]],
      phone1: [dt.dgd_phone, [Validators.required]],
      dgd_id1: [dt.dgd_id],
      action1: ['U']
    });
  }

  addContactFormGroup(): FormGroup {
    console.log('I am in addContact Form group');
    return this.fB.group({
      contact2: ['', [Validators.required, Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*')]],
      contposition2: ['', [Validators.required]],
      contemail2: ['', [Validators.required]],
      contphone2: ['', [Validators.required]],
      contdgd_id: [0],
      contaction: ['A']
    });
  }

  addContactFormGroup2(dt): FormGroup {
    console.log('I am in addContact Edit group', dt);
    return this.fB.group({
      contact2: [dt.dgd_name, [Validators.required, Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*')]],
      contposition2: [dt.dgd_position, [Validators.required]],
      contemail2: [dt.dgd_email, [Validators.required]],
      contphone2: [dt.dgd_phone, [Validators.required]],
      contdgd_id: [dt.dgd_id],
      contaction: ['U']
    });
  }

  getStatesData() {
    const obj={sg_id :0}
    this.dataServ.postmethod('States/get',obj).subscribe(
      resp => {
        console.log('Getstates', resp.response);
        this.getstatesresp = resp.response;
      });
  }

  cancelBack() {
    this.router.navigate(['/dashboard']);
  }

  // Image Cropping
  // imageCropped(event: ImageCroppedEvent) {
  //   this.proimg = event.base64;
  //   this.previewUrl = event.base64;
  //   const fileToUpload: File = new File([this.dataURItoBlob(this.previewUrl)], 'filename.png');
  //   this.selectedFile = fileToUpload;
  //   this.uploadedFileName = fileToUpload;
  //   this.showimg = false;
  //   this.showchangeimg = true;
  // }

  // dataURItoBlob(dataURI): Blob {
  //   const byteString = atob(dataURI.split(',')[1]);
  //   const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  //   const ab = new ArrayBuffer(byteString.length);
  //   let ia = new Uint8Array(ab);
  //   for (let i = 0; i < byteString.length; i++) {
  //     ia[i] = byteString.charCodeAt(i);
  //   }
  //   return new Blob([ab], { type: mimeString });
  // }

  // fileChangeEvent(event: any): void {
  //   this.imageChangedEvent = event;
  // }

  // imageLoaded() {
  //   show cropper
  // }
  // cropperReady() {
  //   cropper ready
  // }
  // loadImageFailed() {
  //   show message
  // }

  // Edit AddDealerShip Group
  getDealershipData(dgid) {
    console.log('dealer group id', dgid);
    const dgroupsObj = {
      "dealergroupid": dgid,
      "expression": "dg_status = 'Y'"
    };
    this.adminServ.GetDealershipGroups(dgroupsObj).subscribe((resp: any) => {
      console.log('Edit AddGroup', resp);
      if (resp.status == 200) {
        this.getdgroups = JSON.parse(resp.response[0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B']);
        this.getdgroups = this.getdgroups[0];
        console.log('Edit AddGroup Original', this.getdgroups);
        if (this.getdgroups != '') {
          this.dshipForm = this.fB.group({
            dship: [this.getdgroups.dg_name, [Validators.required, Validators.maxLength(1000), Validators.pattern('[a-zA-Z0-9 ]*')]],
            address: [this.getdgroups.dg_address1, [Validators.required, Validators.maxLength(1000)]],
            quantities: this.fB.array([]),
            dcity: [this.getdgroups.dg_city, [Validators.required, Validators.maxLength(50)]],
            state: [this.getdgroups.dg_state, [Validators.required]],
            zip: [this.getdgroups.dg_zip, [Validators.required, Validators.maxLength(10)]],
            country: [185, [Validators.required]],
            phone: [this.getdgroups.dg_phone, [Validators.required]],
            webaddress: [this.getdgroups.dg_websiteaddress, [Validators.required]],
            fileUpload: [this.getdgroups.dg_logo],
            avatar: [null]
          });
          this.EditableLogo = this.getdgroups.dg_logo;
          const uctd = this.getdgroups.DealershipGroupDetails;
          this.previewUrl = `${environment.apiUrl}`+'/resources/images/' + this.getdgroups.dg_logo;

          console.log('uctd', uctd);
          for (let y in uctd) {
            if (uctd[y].dgd_type == 'U') {
              (<FormArray>this.popupForm.get('dgUsers')).push(this.addUserFormGroup2(uctd[y]));
            } else if (uctd[y].dgd_type == 'C') {
              (<FormArray>this.popupForm.get('dgContacts')).push(this.addContactFormGroup2(uctd[y]));
            }

          }

        }
      }
    });
  }
}
