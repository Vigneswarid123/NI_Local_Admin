import { Component,Renderer2, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../Core/_providers/api-service/api.service';
import { AlertifyService } from '../../../Core/_providers/alert-service/alertify.service';

@Component({
  selector: 'app-add-region',
  templateUrl: './add-region.component.html',
  styleUrls: ['./add-region.component.scss']
})
export class AddRegionComponent implements OnInit {

  addRegionForm: FormGroup;
  submitted = false;
  public globalResponse: any = [];
  states: any = [];
  groupbrand:boolean=false;
  selectedstate = [];
  selectstate: any;
  showStateDiv = false;
  selectedstateid: any = [];
  selectedStatesList: any = [];


 // @ViewChild('groupbrand') toggleButton: ElementRef;
  @ViewChild('menu', { static: false }) menu: ElementRef;
  selectedItem: any;


  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute,
              private regionSrvc: ApiService, private alertify: AlertifyService,private renderer: Renderer2) {

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
    this.showStateDiv = false;
   this.getstates();

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
    this.addRegionForm = this.formBuilder.group({
      RegionName: ['', [Validators.required, Validators.pattern('[a-zA-Z# ]*'), Validators.maxLength(50)]],
      RegionStates: ['', [Validators.required]],
      Status: ['Y', [Validators.required]]
    });
  }


  onstatesChange(val) {
    console.log(val);
    if (val === '0' || val == null) {
      this.selectstate = ' ';
    } else {
      const ename = this.states.filter(data => data.id === val)[0].region_state_names;
      console.log(ename);
      this.selectstate = ename;
      if (this.selectstate.length > 0) {
        this.selectstate.join(',')
      }
    }
  }
  filter(val: string): string[] {
    return this.states.filter(option =>
      option.sg_name.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  OnChangeEvent(e) {
this.selectedstate=this.filter(e.target.value.toLowerCase())

    this.showStateDiv = true;
    const brlist = this.states;


  }

  selectItem(event: Event, itemid, itemval, index) {
    event.stopPropagation();
    if (itemval != '') {
      //  this.selectedBrands.push(itemval);
      this.selectedstateid.push(itemid);
      this.selectedStatesList.push({ sg_id: itemid, sg_name: itemval });
    }
    if (this.selectedStatesList.length > 0) {
       // this.selectedBrands=this.selectedBrands+',';
      this.selectedStatesList.join(',');
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
    console.log(this.selectedStatesList);
    console.log(this.selectedstateid);
  }

  removeBrandTag(item, index, id){
    this.states.push({sg_id: id, sg_name: item});
    // this.selectedBrands.splice(index,1);
    this.selectedStatesList.splice(index, 1);
    this.selectedstateid.splice(index, 1);

  }

  getstates() {
    this.regionSrvc.getStates('states?185').subscribe(
      response => {
         console.log('Getstates', response.response);
        this.states =  response.response;
  });
}

highlightRow(option){
  this.selectedItem = option.sg_name;
}
  onSubmit() {
    this.submitted = true;
    // if (this.addRegionForm.invalid) {
    //   return;
    // }
    const obj = {
      RegionName: this.addRegionForm.value.RegionName,
      RegionStates : this.selectedstateid.join(','),
      Status: 'Y'
    };
    console.log(obj);
    this.regionSrvc.addRegion(obj).subscribe(

      response => {
        this.globalResponse = response;
        console.log(response);
        if (this.globalResponse.status == 200) {
          this.alertify.success('Region added successfully');
          console.log(this.globalResponse);
          this.router.navigate(['regions']);
        }

        else {
          this.alertify.error('Please check the details');
        }

      });
  }
}
