import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ApiService} from '../../Core/_providers/api-service/api.service';



@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-DMSNames',
  templateUrl: './DMSNames.component.html',
  styleUrls: ['./DMSNames.component.scss']
})
export class DMSNamesComponent implements OnInit {
  UserForm: FormGroup;
  submitted = false;
  Dashboard = true;
  AddShow = false;
  Name: string;


  action = 'A';
 dmsnames: any = [];
 status: any ;
 dmsid: any = 0;


  constructor(private apiSrvc: ApiService, private formBuilder: FormBuilder) {
    this.getdmsnames();
   }


  // tslint:disable-next-line: typedef
  ngOnInit() {

    this.UserForm = this.formBuilder.group({
      // id: [],
     Name: ['', [Validators.required]],

      status: []
    });
    }
  // tslint:disable-next-line: typedef

  adddms(){
  this.Dashboard = false;
  this.AddShow = true;
  this.action = 'A';
  this.dmsid = 0;
  this.UserForm.reset();
  this.submitted = false;

 }




  getdmsnames(){
  this.dmsnames = [];
  const getdata = {id: 0};
  this.apiSrvc.Getdmsnames(getdata).subscribe((data: any) => {
  console.log(data);
  if (data.message == 'success'){
        for (let i = 0; i < data.response.length; i++ ){
         this.dmsnames.push (data.response[i]);
        }
       }
      else{this.dmsnames.push(data.response); }
   });
   }





 editButtonClick(id){
   this.dmsid = id;
   this.AddShow = true;
   this.Dashboard = false;
   this.action = 'U';
  //  this.dmsnames = [];
   const obj = {id};
   this.apiSrvc.Getdmsnames(obj).subscribe((data: any) => {
     console.log('dms:', data);
     if (data.message == 'success'){
       this.UserForm.patchValue({
         id: data.response[0].ttl_dms_id,
         Name: data.response[0].ttl_dms_name,
         status: data.response[0].ttl_dms_status
       });
       this.status = data.response[0].ttl_dms_status;
     }
     console.log('Edited', data);
   });
   this.getdmsnames();
 }





Delete(id){
  const obj={dms_id : id}
this.apiSrvc.delete(obj).subscribe((data: any) => {
    console.log(data);
    // tslint:disable-next-line: triple-equals
    if (data.message == 'success'){
      alert(data.response);
      this.Dashboard = true;
      this.AddShow = false;
      this.getdmsnames();
      this.UserForm.reset();
    }
  });
 }




 checkstatus(evt){
  const target = evt.target;
  if (target.checked) {
    this.status = 'Y';
  } else {
    this.status = 'N';
  }
}



Save(){
  // const uId = localStorage.getItem('uId');
  this.submitted = true;
  console.log(this.UserForm);
  if (this.UserForm.invalid){
       console.log('invalid');
       return;
     }
  const formValue = this.UserForm.value;


  // if (formValue.status == true) {
  //     this.status = 'Y';
  //   }
  //   else {
  //     this.status = 'N';
  //   }
  // Add
  let dmsData;
  if (this.dmsid == 0){
    dmsData = {
      // "action": this.action,
      dms_name: formValue.Name,
      // 'dept_uid': uId,
      // "dms_id": '',
       dms_status: 'Y'

    };
  }
  // update
    else{
      dmsData = {
        // "action": this.action,
        dms_id: this.dmsid,
        dms_name: formValue.Name,
        // dept_updateduserid: uId,
        dms_status: this.status,


      };
    }

  console.log(dmsData);
  if (this.dmsid == 0){
  this.apiSrvc.postmethod('dmsnames', dmsData).subscribe((data: any) => {
      console.log(data);
      // tslint:disable-next-line: triple-equals
      if (data.message == 'success'){
        alert(data.response);
        this.Dashboard = true;
        this.AddShow = false;
        this.getdmsnames();
        this.UserForm.reset();
      }
      else
      {

      }

    });
  }
  else {
    this.apiSrvc.putmethod('dmsnames', dmsData).subscribe((data: any) => {
      console.log(data);
      // tslint:disable-next-line: triple-equals
      if (data.message == 'success'){
        alert(data.response);
        this.Dashboard = true;
        this.AddShow = false;
        this.getdmsnames();
        this.UserForm.reset();
      }
      else
      {

      }

    });

  }

}



  showGridPanel(){
    this.Dashboard = true;
    this.AddShow = false;
    this.getdmsnames();



  }

}
