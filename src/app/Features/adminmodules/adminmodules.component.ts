import { Component, OnInit } from '@angular/core';
import { AdminServiceService } from '../../Core/_providers/admin-service/admin-service.service';
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { ApiService } from '../../Core/_providers/api-service/api.service';
import { AlertifyService } from '../../Core/_providers/alert-service/alertify.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-adminmodules',
  templateUrl: './adminmodules.component.html',
  styleUrls: ['./adminmodules.component.scss']
})
export class AdminmodulesComponent implements OnInit {
  SearchText: any;
  grid: boolean = true;
  editadmin: boolean = false;
  editsubmodule: boolean = false;
  addsubmodule: boolean = false;
  addadmin: boolean = false;
  atozFltr: boolean = false;
  hide: boolean = false;
  alphaSrch: string = '';
  AdminInfo: any = [];
  alphaColumns: any = ["mod_name"];
  SearchAdminForm: FormGroup;


  submitted = false;
  public globalResponse: any = [];
  public subModuleResponse: any = [];
  public updatedResponse: any = [];
  public updatedSubModuleResponse: any = [];
  public insertedResponse: any = [];
  public editAdmin: any = [];
  public editSubModule: any = [];
  editAdminModule: any = [];
  editAdminSubModule: any = [];
  addSubModule: any = [];
  addAdminModule: any = [];
  adminModuleForm: FormGroup;
  subModuleForm: FormGroup;
  addSubModuleForm: FormGroup;
  addAdminModuleForm: FormGroup;
  activeStatus: string;
  adminStatus: string;
  activeStatusAdd: string;
  addadminStatus: string;
  subResult: string;
  Result: string;
  AdminImage: any;
  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  uploadedFileName: any;
  image: any;
  imagepath = `${environment.apiUrl}`+'/resources/images/';



  constructor(private service: AdminServiceService, private fb: FormBuilder, private userSrvc: ApiService, private alertify: AlertifyService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.adminList();
    this.adminModuleForm = this.fb.group({

      mod_name: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.maxLength(50)]],
      mod_seq: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.maxLength(5)]],
      // mod_uid: ['', [Validators.required,Validators.pattern('[0-9]*'),Validators.maxLength(5)]],
      mod_admin: ['', [Validators.required]],
      mod_front: ['', [Validators.required]],
      mod_status: [''],
      mod_image: [''],
      avatar: [null]
    })

    this.addAdminModuleForm = this.fb.group({

      mod_name: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.maxLength(50)]],
      mod_seq: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.maxLength(5)]],
      // mod_uid: ['', [Validators.required,Validators.pattern('[0-9]*'),Validators.maxLength(5)]],
      mod_admin: ['Y', [Validators.required]],
      mod_front: ['N', [Validators.required]],
      mod_status: [true, [Validators.requiredTrue]],
      mod_image: ['', [Validators.required]],
      avatar: [null]
    });

    this.subModuleForm = this.fb.group({

      smod_name: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.maxLength(50)]],
      smod_filename: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.maxLength(50)]],
      smod_seq: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.maxLength(5)]],
      smod_active: ['']

      // smod_id: 1
      // smod_mod_id: 20

    })
    this.addSubModuleForm = this.fb.group({

      smod_name: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.maxLength(50)]],
      smod_filename: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.maxLength(50)]],
      smod_seq: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.maxLength(5)]],
      smod_active: [true, [Validators.requiredTrue]]

      // smod_id: 1
      // smod_mod_id: 20

    })
    this.SearchAdminForm = this.fb.group({
      txtSearch: ""
    });

  }

  adminList() {
    const obj = {
      "ID": 0,
      "expression": ""

    }
    this.service.AdminModules(obj).subscribe(
      response => {
        this.globalResponse = response;
        this.AdminInfo = this.globalResponse.response
        if (this.globalResponse.response == "") {
          this.Result = "No Result Found!!!"
        }
        else {
          this.Result = "";
        }
        console.log(this.globalResponse);
      });

  }
  subModuleList() {
    const obj = {
      "modId": this.editAdminModule.mod_id,
      "subId": 0,
      "expression": ""

    }
    console.log(obj)
    this.service.adminSubModules(obj).subscribe(
      response => {
        this.subModuleResponse = response;
        if (this.subModuleResponse.response == "") {
          this.subResult = "No Result Found!!!";

        }
        else {
          this.subResult = "";
        }

        console.log(this.subModuleResponse);
      });

  }


  public processFile(fileInput: any): void {
    this.fileData = <File>fileInput.target.files[0];
    this.uploadedFileName = <File>fileInput.target.files[0].name;
    console.log('file upload', this.uploadedFileName);
    console.log(this.fileData)
    const file = (fileInput.target as HTMLInputElement).files[0];
    this.addAdminModuleForm.patchValue({
      avatar: file
    });

    this.addAdminModuleForm.get('avatar').updateValueAndValidity();

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

  updateAdminonSubmit() {
    this.submitted = true;
    console.log('hi')
    if (this.adminModuleForm.invalid) {
      return;
    }
    const fd: any = new FormData();
    this.editAdmin = this.adminModuleForm.value;
    console.log(this.editAdmin)
    // if (this.editAdmin.mod_status == true) {
    //   this.adminStatus = "Y"
    // }
    // console.log(this.uploadedFileName)
    if (this.uploadedFileName == '' || this.uploadedFileName == undefined) {
      console.log(this.uploadedFileName);
      // console.log(this.image);
      this.AdminImage = this.image;
      console.log(this.AdminImage);
      this.fileData = null;
      console.log(this.fileData);
    }
    else {
      // this.AdminImage=this.fileData
      console.log(this.fileData);
    }

    fd.append('mod_id', this.editAdminModule.mod_id)
    fd.append('mod_name', this.editAdmin.mod_name)
    fd.append('mod_seq', this.editAdmin.mod_seq)
    fd.append('mod_uid', this.editAdminModule.mod_uid)
    fd.append('mod_admin', this.editAdmin.mod_admin)
    fd.append('mod_front', this.editAdmin.mod_front)
    fd.append('mod_status', this.editAdmin.mod_status)
    fd.append('mod_image', this.AdminImage)
    fd.append('file', this.fileData)


    console.log(this.editAdminModule.mod_id, this.AdminImage, this.editAdmin.mod_name, this.editAdmin.mod_seq, this.editAdmin.mod_admin, this.editAdmin.mod_front, this.adminStatus)
    console.log(fd)
    this.service.Putmethod('adminmodules', fd).subscribe(response => {
      console.log(response)
      this.updatedResponse = response;
      if (this.updatedResponse.status == 200) {
        this.alertify.success('AdminModule Updated successfully');
        this.submitted = false;
        console.log(this.updatedResponse);

        this.uploadedFileName = ''
        this.previewUrl = '';
        this.grid = true;
        this.editadmin = false;
        this.adminList();


      }
      else {

        this.alertify.error('Please check the details');
      }
    });
    (error) => {

      console.log(error);
    };




  }



  updateSubModuleonSubmit() {
    this.submitted = true;

    if (this.subModuleForm.invalid) {
      return;
    }
    else {
      const val = this.subModuleForm.value;
      console.log(val);
      if (val.smod_active == true) {
        this.activeStatus = "Y"
      }
      console.log(this.activeStatus)
      const obj = {
        smod_id: this.editAdminSubModule.smod_id,
        smod_mod_id: this.editAdminModule.mod_id,
        smod_name: val.smod_name,
        smod_seq: val.smod_seq,
        smod_filename: val.smod_filename,
        smod_active: val.smod_active
      }
      console.log(obj)
      this.service.updateSubModule(obj).subscribe(response => {
        this.updatedSubModuleResponse = response;
        if (this.updatedSubModuleResponse.status == 200) {
          this.alertify.success('SubModule Updated successfully');
          this.submitted = false;

          console.log(this.updatedSubModuleResponse)
          this.editsubmodule = false;
          this.editadmin = true;

          this.subModuleList();
        }
        else {

          this.alertify.error('Please check the details');
        }
      });
      (error) => {

        console.log(error);
      };
    }
  }

  addSubModuleonSubmit() {
    this.submitted = true;
    if (this.addSubModuleForm.invalid) {
      return;
    }

    console.log('hi')
    this.addSubModule = this.addSubModuleForm.value;
    console.log(this.addSubModule)
    if (this.addSubModule.smod_active == true) {
      this.activeStatusAdd = "Y"
    }
    const obj = {
      smod_mod_id: this.editAdminModule.mod_id,
      smod_name: this.addSubModule.smod_name,
      smod_seq: this.addSubModule.smod_seq,
      smod_filename: this.addSubModule.smod_filename,
      smod_active: this.activeStatusAdd,
    }
    console.log('hi')
    console.log(obj)
    this.service.addSubModule(obj).subscribe(response => {
      this.updatedSubModuleResponse = response;
      if (this.updatedSubModuleResponse.status == 200) {
        this.alertify.success('SubModule Added successfully');
        this.resetSubModule();
        this.submitted = false;
        this.addsubmodule = false;
        this.editadmin = true;

        this.subModuleList();
        console.log(this.updatedSubModuleResponse)
      }
      else {

        this.alertify.error('Please check the details');
      }
    });
    (error) => {

      console.log(error);
    };
  }

  addAdminonSubmit() {
    this.submitted = true;
    console.log('hi')
    if (this.addAdminModuleForm.invalid) {
      return;
    }
    const fd = new FormData();
    this.addAdminModule = this.addAdminModuleForm.value;
    console.log(this.addAdminModule)
    if (this.addAdminModule.mod_status == true) {
      this.addadminStatus = "Y"
    }

    console.log(this.uploadedFileName, this.addAdminModule.mod_name, this.addAdminModule.mod_seq, this.addAdminModule.mod_admin, this.addAdminModule.mod_front, this.addadminStatus)

    fd.append('mod_name', this.addAdminModule.mod_name)
    fd.append('mod_seq', this.addAdminModule.mod_seq)
    fd.append('mod_uid', '1')
    fd.append('mod_admin', this.addAdminModule.mod_admin)
    fd.append('mod_front', this.addAdminModule.mod_front)
    fd.append('mod_status', this.addadminStatus)
    fd.append('file', this.fileData)
    console.log(fd)

    console.log("api call")
    this.service.postmethod('adminmodules', fd).subscribe(response => {
      console.log(response)
      this.insertedResponse = response;
      if (this.insertedResponse.status == 200) {
        this.alertify.success('AdminModule Added successfully');
        this.submitted = false;
        //  location.reload();
        this.uploadedFileName = '';
        this.resetAdminModule();

        this.uploadedFileName = ''
        this.previewUrl = '';
        this.grid = true;
        this.addadmin = false;
        this.adminList();
        console.log(this.insertedResponse)


      }
      else {

        this.alertify.error('Please check the details');
      }
    });
    (error) => {

      console.log(error);
    };

  }


  addSubMod() {
    this.submitted = false;
    this.grid = false;
    this.editadmin = false;
    this.editsubmodule = false;
    this.addsubmodule = true;

  }

  ActionAdmin(val) {
    this.grid = false;
    this.editadmin = true;
    this.editsubmodule = false;
    this.addsubmodule = false;
    console.log(val)
    this.editAdminModule = val;
    // if (this.editAdminModule.mod_status == "D") {
    //   this.editAdminModule.mod_status = false;
    // }
    // else {
    //   this.editAdminModule.mod_status = true;
    // }
    console.log(this.editAdminModule);
    console.log(this.editAdminModule.mod_image)
    this.subModuleList();
    if (this.editAdminModule.mod_image == null || this.editAdminModule.mod_image == '') {
      this.previewUrl = 'assets/Images/defaultperson.png';
      console.log("default")
    }
    else {
      this.image = this.editAdminModule.mod_image;

      this.previewUrl = this.imagepath + this.editAdminModule.mod_image;
      // this.previewUrl='http://throttleapi.azaz.com/api/resources/images/'+this.editAdminModule.mod_image;
      console.log("original" + this.image);
      console.log(this.uploadedFileName);
    }

  }


  backgrid() {
    this.uploadedFileName = '';
    this.previewUrl = '';
    this.grid = true;
    this.editadmin = false;
    this.editsubmodule = false;
    this.addsubmodule = false;
    this.addadmin = false;
    this.adminList();
  }

  ActionSubAdmin(val) {
    this.grid = false;
    this.editadmin = false;
    this.editsubmodule = true;
    this.addsubmodule = false;
    this.addadmin = false;
    this.submitted = false;
    this.editAdminSubModule = val;
    // if (this.editAdminSubModule.smod_active == "Y") {
    //   this.editAdminSubModule.smod_active = true;
    // }
    // else {
    //   this.editAdminSubModule.smod_active = false;
    // }
    // console.log(this.editAdminSubModule);


  }


  resetSubModule() {

    this.addSubModuleForm.controls.smod_name.reset("");
    this.addSubModuleForm.controls.smod_filename.reset("");
    this.addSubModuleForm.controls.smod_seq.reset("");
  }

  resetAdminModule() {


    this.addAdminModuleForm.controls.mod_name.reset("");
    this.addAdminModuleForm.controls.mod_seq.reset("");


  }

  backeditadmin() {
    this.submitted = false;
    this.addSubModuleForm.markAsPristine();
    this.addSubModuleForm.markAsUntouched();
    this.grid = false;
    this.editadmin = true;
    this.editsubmodule = false;
    this.addsubmodule = false;
    this.addadmin = false;
    this.subModuleList();
    this.resetSubModule();

  }

  addAdmin() {
    this.submitted = false;
    this.grid = false;
    this.editadmin = false;
    this.editsubmodule = false;
    this.addsubmodule = false;
    this.addadmin = true;

    this.addAdminModuleForm.setErrors(null);

    this.addAdminModuleForm.markAsPristine();
    this.addAdminModuleForm.markAsUntouched();
  }

  afteradd() {
    this.previewUrl = '';
    this.resetAdminModule();
    this.addAdminModuleForm.markAsPristine();
    this.addAdminModuleForm.markAsUntouched();
    this.grid = true;
    this.editadmin = false;
    this.editsubmodule = false;
    this.addsubmodule = false;
    this.addadmin = false;
    this.adminList();

    //  location.reload();

  }

  onAlphaCatch(alphabet) {
    console.log("hii")
    this.hide = true;
    this.atozFltr = true;
    this.alphaSrch = alphabet;
    console.log("Alphabet" + this.alphaSrch);
  }

  onSearch() {
    this.alphaSrch = this.SearchAdminForm.controls['txtSearch'].value;
  }

  atoZClick() {
    if (!this.atozFltr)
      this.atozFltr = true;
    else
      this.atozFltr = false;
  }

}
