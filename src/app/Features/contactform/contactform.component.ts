import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators,NgControl } from '@angular/forms';
import { ApiService } from'../../Core/_providers/api-service/api.service';
import {IpServiceService} from "../../Core/_providers/ip-service/ip-service.service";
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contactform',
  templateUrl: './contactform.component.html', 
  styleUrls: ['./contactform.component.scss']
})
export class ContactformComponent implements OnInit {

  contactForm : FormGroup
  showgrid=true;
  addclick=false;
  Brands: any[];
  selectedbrandid: any=[];
  groupNames: any[];
  dealergroups: any=[];
  submitted: boolean=false;
  dealerships: any[];
  groupid: any;
  dealershiplist: any=[];
  selectedItem: any;
  selectedDealershipId: any;
  showDealershipDiv: boolean;
  selectingdealershiplist: any=[];
  dealershipdata: any;
  stateslist: any=[];
  selectedBrandItem: any;
  showBrandDiv: boolean;
  selectedBrands: any[];
  selectedBrandsList: any=[];
  contractsList: any=[];

  noContract:boolean=false;
  contactId: any=0;
  dateValue:any="";
 
  phoneFormat: any[] = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  @ViewChild('#dealermenu', { static: false }) dealermenu: ElementRef;
  @ViewChild('#brandmenu', { static: false }) brandmenu: ElementRef;
  ipAddress: any;

  constructor(private fB: FormBuilder, private ApiService: ApiService,private renderer: Renderer2,private ip:IpServiceService, private router: Router) {

    this.renderer.listen('window', 'click',(e:Event)=>{
      //console.log(this.menu.nativeElement.value);
      //if(e.target !== this.menu.nativeElement){
        if(this.dealermenu == undefined){
        this.showDealershipDiv=false; 
      }
      else
      this.showBrandDiv=false; 

      if(this.brandmenu == undefined)
        this.showBrandDiv = false;
    });

    this.contactForm=this.fB.group({
      dealershipname: ['', [Validators.required, Validators.maxLength(51)]],
      groupname:['',Validators.required],
      addrs1: ['',Validators.required],
      addrs2:[''],
      city: ['',Validators.required],
      state: ['',Validators.required],
      country: ['',Validators.required],
      contactname: ['',[Validators.required,Validators.maxLength(51)]],
      zip: ['',Validators.required],
      contactphone: ['',Validators.required],
      phone: ['',Validators.required],
      contactemail : ['',Validators.required],
      brand  : ['',Validators.required],
      niterms : ['',Validators.required],
      setupfee : ['',Validators.required],
      dealertitle : ['',[Validators.required,Validators.maxLength(51)]],
      setupfeecredit : ['',Validators.required],
      monthfee : ['',Validators.required],
      contractdate : ['',Validators.required],
      dms : ['',Validators.required],
      agent : ['',Validators.required],
      productname : ['', Validators.required]

    });
   }

  ngOnInit(): void {
    this.getIP(); 
    this.getContractFormData();
    this.getBrands();
     this.getGroups();
     this.getStates();
  }
 getIP()  
  {  
    this.ip.getIPAddress().subscribe((res:any)=>{  
      this.ipAddress=res.ip;  
      console.log(this.ipAddress)
    });  
  } 
  getContractFormData(){
    this.contractsList = [];
    const obj={id : 0}
    this.ApiService.getContractForm(obj).subscribe((res:any)=>{
      console.log(res);
      if(res.status == 200){
        if(res.response[0] != '')
        this.contractsList=res.response;
        else 
           this.noContract=true;

      }

    })
    
  }
  showAddPanel(){
    this.addclick = true;
    this.showgrid = false;
   
    this.getBrands();
    
    
    
    this.selectedBrandsList=[];
    this.selectedbrandid=[];
  }
  getBrands(){
    this.Brands=[];
    const obj = { "brand_id": 0 };
    this.ApiService.GetBrands(obj).subscribe(
      (response: any) => {
        if (response.message == "success") {
          this.Brands = response.response;
          if(this.selectedbrandid !=''){
            if(this.selectedbrandid.length >0){
              for(let i=0;i<this.selectedbrandid.length;i++){
                // this.Brands.splice(i,1);
                this.Brands = this.Brands.filter(item => item.brand_id != this.selectedbrandid[i])
              }
           }
          }
          console.log(this.Brands)
        }
       
      });
  }
  highlightBrandRow(option){
    this.selectedBrandItem=option.brand_name;
  }
  onchange(event){
    this.selectedBrands=this.Brands.filter(option =>
      option.brand_name.toLowerCase().indexOf(event.target.value.toLowerCase()) === 0);
      this.showBrandDiv=true;
  }
  selectBrandItem(e,option,i){
    e.stopPropagation();
    if(this.selectedbrandid == ''){
      this.selectedbrandid=[];
    }
    if(option !=''){
      this.selectedbrandid.push(option.brand_id);
      this.selectedBrandsList.push({brand_id:option.brand_id,brand_name:option.brand_name});
      this.selectedBrandItem=option;

      if(this.selectedBrandsList.length>0)
        //this.selectedBrands=this.selectedBrands+',';
        this.selectedBrandsList.join(",")
        //if(this.selectedbrandid.length>0)
        //this.selectedbrandid=this.selectedbrandid+',';
        //this.selectedbrandid.join(',')
        //const index=this.Brands.indexOf(itemval);
        //this.Brands.splice(i,1);
        this.Brands = this.Brands.filter(item => item.brand_id != option.brand_id)
        this.showBrandDiv=false;
        this.contactForm.patchValue({
          brand:''});
    }
  }
  getGroups(){
    this.groupNames=[];
    const obj={  "dealergroupid": 0, "expression": "dg_status = 'Y'"}
    this.ApiService.GetDealershipGroups(obj).subscribe((resp:any)=>{
      if(resp.status = 200){
        if(resp.response[0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B'] !=""){
          this.dealergroups = JSON.parse(resp.response[0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B']);
      }
    }
    });
    
  }
  changeGroup(e){
     this.groupid = e.target.value;
     this.getDealerships();
  }

  getDealerships(){
    this.dealerships=[];
    const obj={ "dealerid":0, "expression":  "dealer_dg_id =" + this.groupid};
    this.ApiService.dealershipList(obj).subscribe((res:any)=>{
       if(res.status = 200){
         if(res.response[0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B'] !="")
           this.dealershiplist=JSON.parse(res.response[0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B']);
        else
        this.dealershiplist=[];
       }
    });
  }
  highlightRow(option){
   this.selectedItem = option.dealer_name;
  }
  selectItem(event:Event,item,i){
    event.stopPropagation();
   
    if(item != ''){
     this.selectedDealershipId = item.dealer_id;
         this.selectedItem=item;
        //  this.contactForm=this.fB.group({
        //    dealershipname : item.dealer_name
        //  })

        this.contactForm.patchValue({
          dealershipname: [item.dealer_name],
      // groupname:[''],
      // addrs1: [''],
      // addrs2:[''],
      // city: [''],
      // state: [''],
      // country: [''],
      // contactname: [''],
      // zip: [''],
      // contactphone: [''],
      // phone: [''],
      // contactemail : [''],
      // brand  : [''],
      // niterms : [''],
      // setupfee : [''],
      // dealertitle : [''],
      // setupfeecredit : [''],
      // monthfee : [''],
      // contractdate : [''],
      // dms : [''],
      // agent : ['']
        })
         this.showDealershipDiv=false;
         this.getDealershipData()
    }   
  }
  
  getDealershiponchange(e){
    this.selectingdealershiplist=this.dealershiplist.filter(option =>
      option.dealer_name.toLowerCase().indexOf(e.target.value.toLowerCase()) === 0);
     this.showDealershipDiv=true;
  }
  getStates(){
    this.ApiService.getStates('states?185').subscribe((res:any)=>{
     if(res.status = 200)
       this.stateslist=res.response;

    });
  }
  getDealershipData(){
    const obj={"dealerid": this.selectedDealershipId, "expression": "dealer_dg_id =" + this.groupid};
    this.ApiService.postmethod('dealerships/get', obj).subscribe((response:any)=>{
       if(response.status = 200){
        this.dealershipdata = JSON.parse(response.response[0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B']);
        if(this.dealershipdata !=''){
        let details=this.dealershipdata[0];
          // this.contactForm=this.fB.group({
          //   addrs1:[details.dealer_address1,Validators.required],
          //   addrs2:[details.dealer_address2,Validators.required],
          //   city : [details.dealer_city,Validators.required],
          //   state: [details.dealer_state,Validators.required],
          //   country : [details.dealer_country,Validators.required],
          //   zip : [details.dealer_zip,Validators.required],
          //   phone : [details.dealer_phone,Validators.required]
          // });
          this.contactForm.patchValue({
            addrs1:details.dealer_address1,
              addrs2:details.dealer_address2,
              city : details.dealer_city,
              state: details.dealer_state,
              country : details.dealer_country,
              zip : details.dealer_zip,
              phone : details.dealer_phone
          });
          this.selectedbrandid= details.dealer_brands;
          let britem;
          if(this.selectedbrandid.length > 0){
            for (let i = 0; i < this.selectedbrandid.length; i++) {
              britem = this.Brands.find(x => x.brand_id == this.selectedbrandid[i]);
              //console.log(britem)
              this.selectedBrandsList.push({ brand_id: this.selectedbrandid[i], brand_name: britem.brand_name });
              this.Brands.splice(i, 1);

            }
          }
             
        }

       }
    });
  }
  onkeyPress(event:any){
    const pattern = /[0-9+( )-]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  // getBrandByid(id) {
  //   return this.Brands.find(x => x.brand_id == id);
  // }
  editContractForm(id){
    this.selectedbrandid=[];
    this.selectedBrandsList=[];
    //this.getGroups();
    this.contactId= id;
    const obj={id : id}
    this.ApiService.getContractForm(obj).subscribe((res:any)=>{
      console.log(res);
      if(res.status = 200){
        this.addclick = true;
        this.showgrid = false;
        let contractdetails=res.response[0];
        this.contactForm=this.fB.group({
          dealershipname: [contractdetails.dsc_dlrshipname, [Validators.required]],
      groupname:[contractdetails.dsc_group, [Validators.required]],
      addrs1: [contractdetails.dsc_addr1, [Validators.required]],
      addrs2:[contractdetails.dsc_addr2],
      city: [contractdetails.dsc_city, [Validators.required]],
      state: [contractdetails.dsc_state, [Validators.required]],
      country: [contractdetails.dsc_country, [Validators.required]],
      contactname: [contractdetails.dsc_dealercontactname, [Validators.required]],
      zip: [contractdetails.dsc_zip, [Validators.required]],
      contactphone: [contractdetails.dsc_dealercontactphone, [Validators.required]],
      phone: [contractdetails.dsc_phone, [Validators.required]],
      contactemail : [contractdetails.dsc_dealercontactmail, [Validators.required]],
      brand  : [''],
      niterms : [contractdetails.dsc_niterms, [Validators.required]],
      setupfee : [contractdetails.dsc_setupfee, [Validators.required]],
      dealertitle : [contractdetails.dsc_dealertitle, [Validators.required]],
      setupfeecredit : [contractdetails.dsc_setupfeecredit, [Validators.required]],
      monthfee : [contractdetails.dsc_amount, [Validators.required]],
      contractdate : [contractdetails.dsc_contractdate,[Validators.required]],
      dms : [contractdetails.dsc_dms, [Validators.required]],
      agent : [contractdetails.dsc_agent, [Validators.required]],
      productname : [contractdetails.dsc_product_name, [Validators.required]]
        });
       //this.selectedbrandid = contractdetails.dsc_brands;
      // this.dateValue = contractdetails.dsc_contractdate;
       if(contractdetails.dsc_brands.length > 0){
        let result= contractdetails.dsc_brands.split(',');
        for(let y in result){
          let item= this.Brands.filter(b=>b.brand_id == result[y]);
        this.selectedBrandsList.push({brand_id:result[y],brand_name:item[0].brand_name});
        this.selectedbrandid.push(result[y].split('_')[0]);
        }
       }
       else{
        this.selectedbrandid.push( contractdetails.dsc_brands);
       }
       this.getBrands();
      }

    });
  }
  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    //this.events.push(`${type}: ${event.value}`);
    this.dateValue.push(`${event.value}`);
  }
  OnSubmit(){
    this.submitted = true;
    //console.log(this.contactForm.value)
    if(this.selectedbrandid !='')
    this.contactForm.patchValue({
      brand : this.selectedbrandid
    })
    if(this.contactForm.invalid)
     return
     if(this.contactId == 0)
       this.dateValue=this.contactForm.value.contractdate.toISOString();
     else if( this.contactId > 0){
        if(this.dateValue == "")
          this.dateValue=this.contactForm.controls.contractdate.value;
        else
          this.dateValue=this.contactForm.value.contractdate.toISOString();
     }
    // else     
       
       
     const cform={
      dealership_name: this.contactForm.value.dealershipname,
      dlr_group:this.contactForm.value.groupname,
      dlrship_address1: this.contactForm.value.addrs1,
      dlrship_address2: this.contactForm.value.addrs2,
      dlrship_city: this.contactForm.value.city,
      dlrship_state: this.contactForm.value.state,
      dlrship_country: this.contactForm.value.country,
      
      dlrship_zip: this.contactForm.value.zip,
      dlr_contractdate: this.dateValue,
      dlrship_phone: this.contactForm.value.phone,
      dlr_contactmail : this.contactForm.value.contactemail,
      dlr_contactname: this.contactForm.value.contactname,
      dlr_contactphone: this.contactForm.value.contactphone,
      dlr_brands : this.selectedbrandid,
      dlr_dms : this.contactForm.value.dms,
      dlr_agent : this.contactForm.value.agent,
      dlr_setupfee : this.contactForm.value.setupfee,
      dlr_setupfeecredit : this.contactForm.value.setupfeecredit,
      dscn_iterms : this.contactForm.value.niterms,
      dsc_amount : this.contactForm.value.monthfee,
      dlr_title : this.contactForm.value.dealertitl,
      "created_Id" : localStorage.getItem('UserId'),
      "updated_Id" : 0,
      dlr_ipaddress : this.ipAddress,
      dlr_productname : this.contactForm.value.productname
     }
     
     if(this.contactId == 0){
     this.ApiService.postmethod('dealershipcontractform',cform).subscribe((res:any)=>{
       console.log(res);
       if(res.status == 200){
        alert('Contact Form added successfully');
          this.showgrid=true;
          this.addclick=false;
          this.getContractFormData();


       }

     });
    }
    else {
      const cformupdate={
        dsc_id : this.contactId,
        dealership_name: this.contactForm.value.dealershipname,
        dlr_group:this.contactForm.value.groupname,
        dlrship_address1: this.contactForm.value.addrs1,
        dlrship_address2: this.contactForm.value.addrs2,
        dlrship_city: this.contactForm.value.city,
        dlrship_state: this.contactForm.value.state,
        dlrship_country: this.contactForm.value.country,
        
        dlrship_zip: this.contactForm.value.zip,
        dlr_contractdate: this.dateValue,
        dlrship_phone: this.contactForm.value.phone,
        dlr_contactmail : this.contactForm.value.contactemail,
        dlr_contactname: this.contactForm.value.contactname,
        dlr_contactphone: this.contactForm.value.contactphone,
        dlr_brands : this.selectedbrandid,
        dlr_dms : this.contactForm.value.dms,
        dlr_agent : this.contactForm.value.agent,
        dlr_setupfee : this.contactForm.value.setupfee,
        dlr_setupfeecredit : this.contactForm.value.setupfeecredit,
        dscn_iterms : this.contactForm.value.niterms,
        dsc_amount : this.contactForm.value.monthfee,
        dlr_title : this.contactForm.value.dealertitle,
        //"created_Id" : localStorage.getItem('UserId'),
        "updated_Id" : localStorage.getItem('UserId'),
        dlr_ipaddress : this.ipAddress,
        dlr_productname : this.contactForm.value.productname
       }
      this.ApiService.putmethod('dealershipcontractform',cformupdate).subscribe((res:any)=>{
        console.log(res);
        if(res.status == 200){
          alert('Contact Form updated successfully');
           this.showgrid=true;
           this.addclick=false;this.getContractFormData();
 
    
        }
 
      });
    }


  }

  showGridPanel(){
    this.addclick=false;
    this.showgrid=true;
    this.getContractFormData();
  }

  ContactFormView(id){
   localStorage.setItem('contactId',id);
   this.router.navigate(['SoftwareAgreement']);
  }
  

}
