import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})



export class ContactComponent implements OnInit {

  ContactpopupForm: FormGroup;
  OemContacts: any = [];
  // contacttype : {[key:string]:number} ={'Primary':1,'Finance':2, 'OEM Lead':3};
  contacttype = [{ id: 1, type: 'Primary' }, { id: 2, type: 'Finance' }, { id: 3, type: 'OEM Lead' }];
  typevalue: any = [];
  selectedItem: any = [];
  // contacttype =[{key :'Primary',value:'Primary'},{ key :'Finance',value:'Finance'}, {key:'OEM Lead',value:'OEM Lead'}];

  // @ViewChild('contacttype', { static: false }) contacttypeval: ElementRef;
  // @ViewChild('selected', { static: false }) selected: ElementRef;

  constructor(private fB: FormBuilder, public dialogRef: MatDialogRef<ContactComponent>) {
    this.ContactpopupForm = this.fB.group({
      cname: ['', [Validators.required, Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*')]],

      cmail: [''],
      cphone: [''],
      ctitle: [''],
      cnotes: [''],
      ctype: [''],
      Contacts: this.fB.array([])


    });
  }

  ngOnInit(): void {
  }
  addContact() {
    const contactobj = {
      contactname: this.ContactpopupForm.value.cname,
      contactphone: this.ContactpopupForm.value.cphone,
      contactemail: this.ContactpopupForm.value.cmail,

      contacttitle: this.ContactpopupForm.value.ctitle,
      contactnotes: this.ContactpopupForm.value.cnotes,
      contacttype: this.ContactpopupForm.value.ctype,
      contactstatus: 'Y',
      'contactgroupbrandtype': 'B',
      'action': 'A'
    };

    this.OemContacts = contactobj;
    this.dialogRef.close(this.OemContacts);
    // const addcontact = this.ContactpopupForm.get('Contacts') as FormArray;

    // (<FormArray>this.ContactpopupForm.get('Contacts')).push(addcontact);


    // addcontact.push(this.fB.group({
    //   name: this.ContactpopupForm.value.cname,
    //   phone: this.ContactpopupForm.value.cphone,
    //   email: this.ContactpopupForm.value.cmail,

    //   title : this.ContactpopupForm.value.ctitle,
    //   notes : this.ContactpopupForm.value.cnotes
    // }))
    // const contactObj = this.ContactpopupForm.get('dgContacts').value;
    // this.OemContacts.push(contactobj);


  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  selectVal(item, index) {
    // if(this.typevalue.length == 0)
    this.selectedItem.push(item);
    this.typevalue.push(item.value);
    //  else
    //  this.typevalue.push(e.target.value);
    // this.contacttype.splice(index,1);
    // delete this.contacttype.item;
    this.contacttype.splice(index, 1);

  }
  removeTag(value, i) {
    this.contacttype.push({ id: value.id, type: value.type });

    this.selectedItem.splice(i, 1);
    // this.selectedbrandid.splice(index,1)
  }

}

export interface contact {
  name: string;
  phone: number;
  email: string;
  title: string;
  notes: string;

}
