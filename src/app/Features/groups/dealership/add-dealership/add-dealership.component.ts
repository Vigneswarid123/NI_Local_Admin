import { Router, Routes } from '@angular/router';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApiService } from '../../../../Core/_providers/api-service/api.service';
import { AddDealermodel } from '../../../../Core/_models/Adddealer';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminServiceService } from '../../../../Core/_providers/admin-service/admin-service.service';
import { DealershipDetailComponent } from '../../dealership/dealership-detail/dealership-detail.component';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-add-dealership',
  templateUrl: './add-dealership.component.html',
  styleUrls: ['./add-dealership.component.scss']
})
export class AddDealershipComponent implements OnInit {
  ImageFolder = 'http://niapi.local.com/api/resources/images/';
  BrandImageFolder = 'http://niapi.local.com/api/resources/images/';
  Getdealership: any;
  Getpositions: any;
  dshipForm: FormGroup;
  submitted = false;
  contactSubmit = false;
  address: any;
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
    dealerwebsiteaddress: '',
    dealergooglemaplink: '',
    dealerstatus: 'Y',
    dealerbrands: '',
    dealerlogo: '',
    dealergroupid: '',
    dealercreateduser: 1001,
    dealerupdateduser: 1001,
    dealerdetails: [{}]
  };
  // user details
  showDiv: Boolean = false;
  staticDiv: Boolean = true;
  popupForm: FormGroup;
  dealerid: any;
  sub: any;
  file: File;
  conts: any;
  users: any;
  id: any;
  getdgroups: any;
  getstatesresp: any = [];
  dealergrpid: any;
  Brands: any;
  selectedBrandlogo: any = [];
  selectedbrandid: any = [];
  showBrandDiv: Boolean = false;
  Editarray: any[];
  EditedLogoFile: any;
  selectedBrands: string[];
  selectedItem: any;
  selectedBrandList: any = [];
  phoneFormat: any[] = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  @ViewChild('txtbrand') toggleButton: ElementRef;
  @ViewChild('brandMenu') menu: ElementRef;

  constructor(private fB: FormBuilder,
    private _Activatedroute: ActivatedRoute,
    private authService: ApiService,
    private router: Router,
    public dialog: MatDialog,
    private adminService: AdminServiceService,
    private apiservice: ApiService, private renderer: Renderer2) {


    this.renderer.listen('window', 'click', (e: Event) => {
      if (e.target !== this.toggleButton.nativeElement && e.target !== this.menu.nativeElement) {
        this.showBrandDiv = false;
      }
    });

    this.GetBrandsList();

    this.dshipForm = this.fB.group({
      dship: ['', [Validators.required, Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*')]],
      address: ['', [Validators.required, Validators.maxLength(50)]],
      quantities: this.fB.array([]),
      dcity: ['', [Validators.required, Validators.maxLength(50)]],
      state: ['', [Validators.required]],
      zip: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      country: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      webaddress: ['', [Validators.required, Validators.maxLength(100)]],
      gmaplink: ['', [Validators.required, Validators.maxLength(1000)]],
      // brand: ['', [Validators.required]],
      fileUpload: ['', [Validators.required]],
      avatar: [null]
    });
  }
  get f() { return this.dshipForm.controls; }
  get f1() { return this.popupForm.controls; }
  ngOnInit() {
    this.getstates();
    this.getpositions();
    //  this.id = this._Activatedroute.snapshot.params.id;
    this.sub = this._Activatedroute.paramMap.subscribe(params => {
      console.log('EditDealerShip', params);
      this.dealerid = params.get('dealerid');
      this.dealergrpid = params.get('id');
    });
    this.EditDealerShip(this.dealerid, this.dealergrpid);
    this.getDealershipData(this.dealergrpid);

    this.popupForm = this.fB.group({
      dgContacts: this.fB.array([]),
      dgUsers: this.fB.array([])
    });
    if (this.dealerid > 0 && this.dealerid != '') {
      this.showDiv = true;
      // this.staticDiv = false;
      this.getDealershipData(this.dealergrpid);
    }
    else {
      (<FormArray>this.popupForm.get('dgUsers')).push(this.addUserFormGroup());
      (<FormArray>this.popupForm.get('dgContacts')).push(this.addContactFormGroup());
    }
  }

  GetBrandsList() {
    let britem;
    const obj = { "brand_id": 0 };
    this.apiservice.GetBrands(obj).subscribe((res: any) => {
      console.log(res.response);
      if (res.status == 200) {
        this.Brands = res.response;
        if (this.selectedbrandid != '') {
          if (this.selectedbrandid.length > 0) {
            for (let i = 0; i < this.selectedbrandid.length; i++) {
              britem = this.getDimensionsByFind(this.selectedbrandid[i]);
              //console.log(britem)
              this.selectedBrandList.push({ brand_id: this.selectedbrandid[i], brand_name: britem.brand_name, brand_logo: britem.brand_logo });
              this.Brands.splice(i, 1);

            }
          }
        }
      }
    });
  }

  getDimensionsByFind(id) {
    return this.Brands.find(x => x.brand_id == id);
  }

  selectItem(e, item, index) {
    e.stopPropagation();
    if (this.selectedbrandid == "")
      this.selectedbrandid = [];
    if (item != '') {
      this.selectedbrandid.push(item.brand_id);
      this.selectedBrandList.push({ brand_id: item.brand_id, brand_name: item.brand_name, brand_logo: item.brand_logo });
      this.selectedItem = item;
    }

    if (this.selectedBrandList.length > 0)
      // this.selectedBrands=this.selectedBrands+',';
      this.selectedBrandList.join(",")

    this.Brands.splice(index, 1);
    this.showBrandDiv = false;
    this.dshipForm.patchValue({
      brand: ''
    });


  }
  close(e) {
    e.stopPropagation();
  }
  OnChangeEvent(e) {
    this.selectedBrands = this.filter(e.target.value.toLowerCase());
    this.showBrandDiv = true;
    // let brlist=this.Brands;

  }

  filter(val: string): string[] {
    return this.Brands.filter(option =>
      option.brand_name.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  selectRow(option) {
    this.selectedItem = option.brand_name;
  }

  removeBrandTag(item, index) {
    this.Brands.push({ brand_id: item.brand_id, brand_name: item.brand_name, brand_logo: item.brand_logo });

    this.selectedBrandList.splice(index, 1);
    this.selectedbrandid.splice(index, 1);

  }

  DealerAddOnSubmit() {
    this.submitted = true;
    if (this.dshipForm.invalid) {
      return;
    }
    const contacts = this.popupForm.get('dgContacts').value;
    const users = this.popupForm.get('dgUsers').value;
    if (contacts[0] || users[0]) {
      if (contacts[0].contact2 == '' && users[0].user1 == '') {
        this.finalObjData.dealerdetails = [{}];
      }
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
    if (this.dealerid > 0 && this.dealerid != "") {
      this.finalObjData.dealerid = this.dealerid;
      this.finalObjData.dealerlogo = this.EditedLogoFile;
      // this.finalObjData.dealergroupdetails = [{}];
    }
    // let Addealermodel = new AddDealermodel(
    this.finalObjData.dealername = this.dshipForm.value.dship;
    this.finalObjData.dealeraddress1 = this.dshipForm.value.address;
    this.finalObjData.dealercity = this.dshipForm.value.dcity;
    this.finalObjData.dealerstate = this.dshipForm.value.state;
    this.finalObjData.dealercountry = this.dshipForm.value.country;
    this.finalObjData.dealerzip = this.dshipForm.value.zip;
    this.finalObjData.dealerphone = this.dshipForm.value.phone;
    this.finalObjData.dealerwebsiteaddress = this.dshipForm.value.webaddress;
    this.finalObjData.dealergooglemaplink = this.dshipForm.value.gmaplink;
    this.finalObjData.dealerbrands = this.selectedbrandid;
    this.finalObjData.dealergroupid = this.dealergrpid;
    // );
    fd.append('data', JSON.stringify(this.finalObjData));

    if (this.uploadedFileName != '' && this.uploadedFileName != undefined)
      fd.append('file', this.fileData);
    else
      fd.append('file', this.EditedLogoFile);

    //fd.append('file', this.dshipForm.get('avatar').value, this.uploadedFileName);
    console.log('Final Obj', this.finalObjData);
    const options = { content: fd };
    if (this.dealerid > 0 && this.dealerid != "") {
      this.adminService.Putmethod('dealerships', fd).subscribe((resp: any) => {
        console.log('Post Resp:', resp);
        console.log('res', resp.status);
        if (resp.status == 200) {
          alert('Dealership Updated Succefully');
          this.router.navigate(['DealershipList', this.dealergrpid]);
        }
      });
    }
    else {
      this.adminService.postmethod('dealerships', fd).subscribe((response: any) => {
        console.log(response);
        if (response.status == 200) {
          alert('Dealership created successfully');
          console.log(response);
          this.router.navigate(['DealershipList', this.dealergrpid]);
        }
      },
        (error) => {
          console.log('error', error);
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
    // console.log(this.dshipForm.get('quantities')['controls']);

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
            return false;
          } else {
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
    // this.dgContacts().removeAt(i);
    this.popupForm.get('dgContacts').value[i].contaction = 'D';
    console.log(this.popupForm.get('dgContacts').value);
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

  allowNumbers(event: any) {
    const pattern = /[0-9+( )-]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

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
    this.contactSubmit = true;
    if (this.popupForm.get('dgUsers').invalid) {
      alert('Please enter the empty fields..!');
      return;
    }
    // if (this.popupForm.invalid) {
    //   alert('Please enter the empty fields..!');
    //   return;
    // }
    else {
      (<FormArray>this.popupForm.get('dgUsers')).push(this.addUserFormGroup());
    }
  }

  addContact(): void {
    console.log('addcontact');
    this.contactSubmit = true;
    // if (this.popupForm.invalid) {
    //   alert('Please enter the empty fields..!');
    //   return;
    // }
    if (this.popupForm.get('dgContacts').invalid) {
      alert('Please enter the empty fields..!');
      return;
    }
    else {
      (<FormArray>this.popupForm.get('dgContacts')).push(this.addContactFormGroup());
    }
  }

  postUser() {
    console.log('contacts and users', this.popupForm.controls);
    this.finalObjData.dealerdetails = [];
    const dguserObj = [];

    const dgcontactobj = [];
    const contactObj = this.popupForm.get('dgContacts').value;

    const usersObj = this.popupForm.get('dgUsers').value;

    for (let x of usersObj) {
      var emptyCount = 0;
      for (const key in x) {
        if ((x[key] == null || x[key] === '') && key !== 'action1' && key !== 'dd_id1') {
          emptyCount = emptyCount + 1;
        }
      }
      if (emptyCount < 4 && emptyCount !== 0) {
        alert('Please enter all User fields..!');
        return false;
      }

      if (x.action1 == 'A') {
        const subObj = {
          action: x.action1,
          ddname: x.user1,
          ddposition: x.position1,
          ddemail: x.email1,
          ddphone: x.phone1,
          ddtype: 'U',
          ddstatus: 'A',
          // dddealerid: '',
          ddcreateduser: '1002',
          ddupdateduser: '1003'
        };
        dguserObj.push(subObj);
      } else {
        const subObj = {
          action: x.action1,
          ddid: x.dd_id1,
          ddname: x.user1,
          ddposition: x.position1,
          ddemail: x.email1,
          ddphone: x.phone1,
          ddtype: 'U',
          ddstatus: 'A',
          // dddealerid: '',
          ddcreateduser: '1002',
          ddupdateduser: '1003'
        };
        dguserObj.push(subObj);
      }
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

      if (y.contaction == 'A') {
        const csubObj = {
          action: y.contaction,
          ddname: y.contact2,
          ddposition: y.contposition2,
          ddemail: y.contemail2,
          ddphone: y.contphone2,
          ddtype: 'C',
          ddstatus: 'A',
          // dddealerid: '',
          ddcreateduser: '1002',
          ddupdateduser: '1003'
        };
        dgcontactobj.push(csubObj);
      } else {
        const csubObj = {
          action: y.contaction,
          ddid: y.contdd_id,
          ddname: y.contact2,
          ddposition: y.contposition2,
          ddemail: y.contemail2,
          ddphone: y.contphone2,
          ddtype: 'C',
          ddstatus: 'A',
          // dddealerid: '',
          ddcreateduser: '1002',
          ddupdateduser: '1003'
        };
        dgcontactobj.push(csubObj);
      }



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
    console.log('I am in adduSer Form group');
    return this.fB.group({
      user1: ['', [Validators.required, Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*')]],
      position1: ['', [Validators.required]],
      email1: ['', [Validators.required]],
      phone1: ['', [Validators.required]],
      dd_id1: [0],
      action1: ['A']
    });
  }
  addUserFormGroup2(dt): FormGroup {
    console.log('I am in adduSer Edit Form group', dt);
    return this.fB.group({
      user1: [dt.dd_name, [Validators.required, Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*')]],
      position1: [dt.dd_position, [Validators.required]],
      email1: [dt.dd_email, [Validators.required]],
      phone1: [dt.dd_phone, [Validators.required]],
      dd_id1: [dt.dd_id],
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
      contdd_id: [0],
      contaction: ['A']
    });
  }
  addContactFormGroup2(dt): FormGroup {
    console.log('I am in addContact Edit Form group', dt);
    return this.fB.group({
      contact2: [dt.dd_name, [Validators.required, Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*')]],
      contposition2: [dt.dd_position, [Validators.required]],
      contemail2: [dt.dd_email, [Validators.required]],
      contphone2: [dt.dd_phone, [Validators.required]],
      contdd_id: [dt.dd_id],
      contaction: ['U']

    });
  }
  getstates() {
    this.adminService.get('states?185').subscribe(
      response => {
        // console.log('Getstates', response.response);
        this.getstates = response.response;
      });
  }

  getpositions() {

    const obj = {
      "p_id": 0
    };
    this.adminService.postmethod('positions/GET', obj).subscribe(
      response => {
        console.log('Getposition', response.response);
        this.Getpositions = response.response;
      });
  }

  EditDealerShip(dsid, gruoupid) {

    const obj =
      {
        "dealerid": dsid,
        "expression": "dealer_dg_id =" + gruoupid,

      }​​​​​​​​;

    this.selectedbrandid = [];
    this.selectedBrandList = [];
    this.adminService.postmethod('dealerships/get', obj).subscribe((response: any) => {
      console.log('EditDealerShip', response);

      if (response.status == 200) {
        this.Getdealership = JSON.parse(response.response[0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B']);
        this.Getdealership = this.Getdealership[0];
        if (this.Getdealership != '') {
          this.dshipForm = this.fB.group({
            dship: [this.Getdealership.dealer_name, [Validators.required, Validators.maxLength(1000), Validators.pattern('[a-zA-Z ]*')]],
            address: [this.Getdealership.dealer_address1, [Validators.required, Validators.maxLength(1000)]],
            quantities: this.fB.array([]),
            dcity: [this.Getdealership.dealer_city, [Validators.required, Validators.maxLength(50)]],
            state: [this.Getdealership.dealer_state, [Validators.required]],
            zip: [this.Getdealership.dealer_zip, [Validators.required, Validators.maxLength(10)]],
            country: [this.Getdealership.dealer_country, [Validators.required]],
            phone: [this.Getdealership.dealer_phone, [Validators.required]],
            webaddress: [this.Getdealership.dealer_websiteaddress, [Validators.required]],
            gmaplink: [this.Getdealership.dealer_googlemaplink, [Validators.required]],
            // brand: [this.Getdealership.dealer_brands],
            fileUpload: [this.Getdealership.dealer_logo],
            avatar: [null]
          });


          if (this.Getdealership.dealer_brands.length > 0)
            this.selectedbrandid = this.Getdealership.dealer_brands.split(',');
          else
            this.selectedbrandid = this.Getdealership.dealer_brands;

          this.EditedLogoFile = this.Getdealership.dealer_logo;

          const uctd = this.Getdealership.DealerDetails;
          this.previewUrl = 'http://niapi.local.com/api/resources/images/' + this.Getdealership.dealer_logo;

          for (let y in uctd) {
            if (uctd[y].dd_type == 'U') {
              // this.showDiv=true;
              (<FormArray>this.popupForm.get('dgUsers')).push(this.addUserFormGroup2(uctd[y]));
            } else if (uctd[y].dd_type == 'C') {
              // this.showDiv=true;
              (<FormArray>this.popupForm.get('dgContacts')).push(this.addContactFormGroup2(uctd[y]));
            }
            // uctd.removeAt(y);
          }
          this.GetBrandsList();


        }


      }
    }​​​​​​​​);
  }



  getDealershipData(DealerID) {
    const dgroupsObj = {
      "dealergroupid": DealerID,
      "expression": ""
    };
    this.authService.GetDealershipGroups(dgroupsObj).subscribe((resp: any) => {
      console.log('Get groups Resp', resp);
      if (resp.status == 200) {
        this.getdgroups = JSON.parse(resp.response[0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B']);
        this.getdgroups = this.getdgroups[0];
        this.conts = this.getdgroups.DealershipGroupDetails.filter(element => {
          return element.dgd_type == 'C';
        });

        this.users = this.getdgroups.DealershipGroupDetails.filter(element => {
          return element.dgd_type == 'U';
        });
        // console.log('dgroups', this.getdgroups);
      }
    });
  }


}
