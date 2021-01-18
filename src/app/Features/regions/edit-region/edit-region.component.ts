import { Component,Renderer2, OnInit, ViewChild,ElementRef} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ApiService } from '../../../Core/_providers/api-service/api.service';
import { AlertifyService } from '../../../Core/_providers/alert-service/alertify.service';

@Component({
  selector: 'app-edit-region',
  templateUrl: './edit-region.component.html',
  styleUrls: ['./edit-region.component.scss']
})
export class EditRegionComponent implements OnInit {

  public globalResponse: any = [];
  public editRegion: any = [];
  addRegionForm: FormGroup;
  submitted = false;
  loading = false;
  Region_Id: number;
  RegionDetails: any = [];

  statedata: any[];
  state: Array<any> = [];
  states: any = [];
  groupbrand:boolean=false;
 regionid = 0;
 selectedStateList: any = [];
 selectedStates: any = [];
 selectedstateid: any = [];
 showStateDiv = false;
 @ViewChild('menu', { static: false }) menu: ElementRef;
 selectedItem: any;
  constructor(  private formBuilder: FormBuilder,
                private router: Router,
                private route: ActivatedRoute,
                private regionSrvc: ApiService,
                private alertify: AlertifyService,private renderer: Renderer2) {
    this.route.queryParams.subscribe(params => {
       this.Region_Id = params.region_id;
       console.log(this.Region_Id);
  });
  this.renderer.listen('window', 'click',(e:Event)=>{
    //console.log(this.menu.nativeElement.value);
    //if(e.target !== this.menu.nativeElement){
      if(this.menu == undefined){
      this.showStateDiv=false; 
    }
    else
    this.showStateDiv=false; 
  });
   }

  ngOnInit(): void {
    this.getstates();
    this.regionEditForm();
    this.editGroup();
  //   this.states = [{
  //     state: '7',
  //     statename: 'Connecticut',
  //   },
  //   {
  //     state: '8',
  //     statename: 'Delaware'
  //   },
  //   {
  //     state: '9',
  //     statename: 'Michigan'
  //   },
  //   {
  //     state: '10',
  //     statename: 'Florida'
  //   },
  //   {
  //     state: '11',
  //     statename: 'California'
  //   }
  // ];
    this.regionEditForm();
    this.addRegionForm = this.formBuilder.group({
      Role_Name: ['', [Validators.required, Validators.pattern('[a-zA-Z# ]*'), Validators.maxLength(50)]],
      Role_States:  ['', [Validators.required]],
      Role_Status: ['', [Validators.required]]
    });
  }
  regionEditForm(){
    this.regionSrvc.getRegion(this.Region_Id).subscribe(
      response => {
        console.log('editres', response);
        this.globalResponse = response;
        this.RegionDetails = this.globalResponse.response[0];
        console.log(this.RegionDetails);
        this.state.push(this.RegionDetails);
      });
  }

  filter(val: string): string[] {
    return this.states.filter(option =>
      option.sg_name.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }
  
  OnChangeEvent(e) {
  this.selectedStates=this.filter(e.target.value.toLowerCase());
  
    this.showStateDiv = true;
    const brlist = this.states;
  
  
  }
  
 
  selectItem(event: Event, itemid, itemval, index) {
    event.stopPropagation();
    if (itemval != '') {
      console.log(itemval)
        // this.selectedStates.push(itemval);
      this.selectedstateid.push(itemval);
      this.selectedStateList.push({ sg_id: itemid, sg_name: itemval });
    }
    if (this.selectedStateList.length > 0) {
       // this.selectedStates=this.selectedStates+',';
      this.selectedStateList.join(',');
    }
    // if(this.selectedstateid.length>0)
    // this.selectedstateid=this.selectedstateid+',';
    // this.selectedstateid.join(',')
    // const index=this.Brands.indexOf(itemval);
    this.states.splice(index, 1);
    this.showStateDiv = false;
    this.addRegionForm.patchValue({
      groupbrands: ''
    });
    console.log('selectedStateList', this.selectedStateList);
    console.log(this.selectedstateid);
  }
  highlightRow(option){
    this.selectedItem = option.sg_name;
  }

  editGroup(){
    this.regionid = this.Region_Id;
    this.selectedStateList = [];

    const obj = { region_id: this.Region_Id };
    this.regionSrvc.getRegion(obj).subscribe((response: any) => {
      console.log('editres', response);
      if (response.status == 200) {

        this.addRegionForm.patchValue({
          Role_Name: response.response[0].region_name,
        });

        if (response.response[0].region_state_names.length > 0){
          const result = response.response[0].region_state_names.split(',');
          // tslint:disable-next-line: forin
          for (const y in result) {

          this.selectedStateList.push({region_name: result[y].split('_')[0], region_state_names: result[y].split('_')[1]});
          }
        }
        else {
           this.selectedStates = response.response[0].region_state_names;
        }
        if (response.response[0].region_state_names.length > 0) {
          this.selectedstateid = response.response[0].region_state_names.split(',');
        }
        else {
        this.selectedstateid = response.response[0].region_state_names;
        }
        console.log(this.selectedstateid);
      }
    });
  }

  removeBrandTag(item, index, id){
    this.states.push({sg_id: id, sg_name: item});
    // this.selectedStates.splice(index,1);
    this.selectedStateList.splice(index, 1);
    this.selectedstateid.splice(index, 1);

  }
  getstates() {
    this.regionSrvc.getStates('states?185').subscribe(
      response => {
         console.log('Getstates', response.response);
        this.getstates =  response.response;
        this.states=response.response;
        console.log('states',this.states)
  });
}



  onSubmit(){
    const obj = {
      RegionId: this.Region_Id,
      RegionName: this.addRegionForm.value.Role_Name,
      RegionStates: this.selectedstateid.join(','),
      Status: 'Y'
        };
    console.log(obj); this.regionSrvc.updateRegion(obj).subscribe((res: any) => {
      console.log('res', res);
      if (res.status === 200) {
        this.alertify.success('Record updated successfully');
        this.router.navigate(['regions']);
      }
      else {
        this.alertify.error('Please check the details');
      }
    });
  }


  updateRoles(): any {}
  // getstates() {
  //   const obj = {
  //     "CountryCode": "US"
  //   }
  //   this.regionSrvc.getstates( obj).subscribe(
  //     response => {
  //     this.statedata = [];
  //     this.statedata = response[0];
  //   }, error => {
  //     console.log(error);

  //   });
  // }

  // updateRoles(): any {
  //   const updateRegion = new regionModel(
  //     this.RegionDetails.region_name,
  //      this.RegionDetails.region_states,
  //      this.RegionDetails.region_status
   //   );
  //   this.regionSrvc.updateRegion(updateRegion).subscribe((res: any) => {
  //     console.log('res', res);
  //     if (res.status === 200) {
  //       this.alertify.success('Record updated successfully');
  //       this.router.navigate(['getregions']);
  //     }
  //     else {
  //       this.alertify.error('Please check the details');
  //     }
  //   });
  // }
}



