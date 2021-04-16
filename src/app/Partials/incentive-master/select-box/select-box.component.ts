import { Component, OnInit ,Input, forwardRef, OnChanges, Output, EventEmitter} from '@angular/core';
import { ControlValueAccessor, FormArray, FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { ListfilterPipe } from '../../../Core/_pipes/listfilter.pipe/listfilter.pipe';
import { ListItem } from '../../../Core/_models/list-item.domain';
import { ApiService } from "../../../Core/_providers/api-service/api.service";
import { AlertifyService } from '../../../Core/_providers/alert-service/alertify.service';
import { Router } from '@angular/router';
declare var $: any;

export const AUI_SELECT_BOX_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectBoxComponent),
  multi: true,
};

@Component({
  selector: 'app-select-box',
  templateUrl: './select-box.component.html',
  styleUrls: ['./select-box.component.scss'],
  providers: [AUI_SELECT_BOX_ACCESSOR, ListfilterPipe]
})
export class SelectBoxComponent implements OnInit {


  @Input('incentiveid') incentiveid: number = 0;
  @Input('incentiveName') glbIncentiveName: string = "";
  @Input('incentiveType') glbIncentiveType: string = "";
  @Output() public FinalArray = new EventEmitter<any>();
  //@Output('FinalArray') public FinalArray: EventEmitter<any>= new EventEmitter<any>();
  @Output() TermCancelClick:EventEmitter<boolean>=new EventEmitter<boolean>();
  dynamicForm: FormGroup;
  termsOptions: any=[];
  SelectedTermItems: any=[];
  SelectedEditTermItems:any=[];
  ComponentFinalArray: any=[];
  globalSelected:boolean=false;
  submitted: boolean=false;
  tacdata: any[];
  RightTermName: any;
  Dealerplaceholder: any;
  termsMultipleOptions: any;
  
  constructor(private ApiService: ApiService,private formBuilder: FormBuilder,private router: Router, private alertify: AlertifyService,) { 
    console.log("id" + this.incentiveid)
    console.log("id" + this.glbIncentiveName)
    this.dynamicForm =this.formBuilder.group({
     // 'termName' : new FormControl({value:this.selectedList}),
      termValues : new FormArray([]),
      termOptionValues : new FormArray([]),
      termMultipleOptionValues:new FormArray([]),
      DealerSpecificTerms:new FormArray([])
    });
  }



   /* paramter used to pass in the list items*/
   @Input() list;
   /* paramter used to pass in the edit list items*/
   @Input('editList') editList;
   /* option to  turn on sort feature on the lists*/
   @Input() sort;
   /* option to turn on search feature on the lists */
   @Input() search;
   /* option to turn on select/unselect all feature on the lists*/
   @Input() selectAll;
   /* option to disable the component*/
   @Input() disabled: boolean = false;
 
 
   /* filter text used to filter items on the left side */
   leftFilterText: string = '';
   /* filter text used to filter items on the right side */
   rightFilterText: string = '';
 
   /* working list of items on the left side */
   originalItems: ListItem[] = [];
   /* working list of items on the right side */
   selectedItems: ListItem[] = [];
 
   /* selected items that will be passed back to form control */
   @Input('value') selectedList: string[] = [];
   @Input() editable: boolean = false;
   Dealerfield:boolean=false;
   isSingleClick: Boolean = true;   
   dropdownList :any= [];
   selectedoptionItems:any= [];
   dropdownSettings = {};
 
  ngOnInit() {
     this.globalSelected=true;
    this.list.forEach(element => {
      $('#'+element.MIT_ID).removeClass('disabled');
      this.originalItems.push(new ListItem(element));

    });
    // this.editList.forEach(element => {
    //   this.originalItems.push(new ListItem(element));
    // });
    console.log(this.editList)
    if(this.editList=="Edit"){
      this.getIncentiveTermaAndConditionsData(this.incentiveid);

    }
    else{
      this.globalSelected=true;
    }

    this.selectedoptionItems = [];
    this.dropdownSettings = { 
      singleSelection: false, 
      text:"Select",  
      selectAllText:'Select All',
      unSelectAllText:'UnSelect All',
      enableSearchFilter: true,
      classes:"myclass custom-class",
      primaryKey:"id",
      badgeShowLimit:1
      // showCheckbox:true,
      // maxHeight:600,
      // badgeShowLimit:3
    };      


    if (this.selectedList != null && this.selectedList != []) {
      this.setSelectedValues(this.selectedList);
      this.onChange(this.value);
    }
  }
  onItemSelect(item:any){
    console.log(item);
    console.log(this.selectedoptionItems);
  }
  OnItemDeSelect(item:any){
      console.log(item);
      console.log(this.selectedoptionItems);
  }
  onSelectAll(items: any){
      console.log(items);
  }
  onDeSelectAll(items: any){
      console.log(items);
  }

  getIncentiveTermaAndConditionsData(id) {
    this.selectedoptionItems = [];
    this.dropdownSettings = { 
      singleSelection: false, 
      text:"Select",  
      selectAllText:'Select All',
      unSelectAllText:'UnSelect All',
      enableSearchFilter: true,
      classes:"myclass custom-class",
      primaryKey:"id",
      badgeShowLimit:1
    }; 
    this.tacdata = [];
    const obj = { "IncentiveId": id, "expression": "" };
    this.ApiService.postmethod('termsandconditions/basedonincentive', obj).subscribe((response: any) => {
      console.log(response);
      if (response.status == 200)
        if (response.response.length != 0){
          this.tacdata = response.response;
          this.globalSelected=false;
          //this.selectedoptionItems=[];
          this.tacdata.forEach(
            element => {
             
               if(element.MIT_TYPE == 1 && element.MIT_ISDEALERSPECIFIC == 'N'){
                 element.selected=true;
                this.selectedItems.push(new ListItem({'MIT_DISPLAYNAME': element.MIT_DISPLAYNAME,'MIT_ID': element.INT_MIT_ID,'MIT_TYPE' : element.MIT_TYPE,'Name':element.TermName,'Value' : element.INT_VALUE}));
                this.SelectedEditTermItems.push({'TermId':element.INT_MIT_ID,'Id': element.INT_ID});
                //this.editInputField(element.INT_MIT_ID,element.INT_VALUE);
              }
              else if(element.MIT_TYPE == 1 && element.MIT_ISDEALERSPECIFIC == 'Y'){
                element.selected=true;
                this.editDealerSpecificField(element.INT_ID,element.INT_MIT_ID,element.INT_VALUE,element.MIT_DISPLAYNAME);
               // this.selectedItems.push(new ListItem({'MIT_DISPLAYNAME': element.MIT_DISPLAYNAME,'MIT_ID': element.INT_MIT_ID,'MIT_TYPE' : element.MIT_TYPE,'Name':element.TermName,'Value' : element.INT_VALUE}));
                this.SelectedEditTermItems.push({'TermId':element.INT_MIT_ID,'Id': element.INT_ID});
                //this.editInputField(element.INT_MIT_ID,element.INT_VALUE);
              }
               if(element.MIT_TYPE == 2 && element.MIT_ISDEALERSPECIFIC == 'N'){
                element.selected=true;
                //this.selectedItems.push(new ListItem({'MIT_DISPLAYNAME': element.MIT_DISPLAYNAME,'MIT_ID': element.INT_MIT_ID,'MIT_TYPE' : element.MIT_TYPE,'Name':element.Name,'Value' : element.INT_VALUE}));
                //this.SelectedEditTermItems.push({'TermId':element.INT_MIT_ID,'Id': element.INT_ID});
                 this.editInputField(element.INT_ID,element.INT_MIT_ID,element.INT_VALUE,element.MIT_DISPLAYNAME);
               }
              else if(element.MIT_TYPE == 2 && element.MIT_ISDEALERSPECIFIC == 'Y'){
                element.selected=true;
                //this.selectedItems.push(new ListItem({'MIT_DISPLAYNAME': element.MIT_DISPLAYNAME,'MIT_ID': element.INT_MIT_ID,'MIT_TYPE' : element.MIT_TYPE,'Name':element.Name,'Value' : element.INT_VALUE}));
                this.SelectedEditTermItems.push({'TermId':element.INT_MIT_ID,'Id': element.INT_ID});
                 this.editDealerSpecificField(element.INT_ID,element.INT_MIT_ID,element.INT_VALUE,element.MIT_DISPLAYNAME);
               }
               if(element.MIT_TYPE == 3 && element.MIT_ISDEALERSPECIFIC == 'N'){
                element.selected=true;
                //this.selectedItems.push(new ListItem({'MIT_DISPLAYNAME': element.MIT_DISPLAYNAME,'MIT_ID': element.INT_MIT_ID,'MIT_TYPE' : element.MIT_TYPE,'Name':element.Name,'Value' : element.INT_VALUE}));
                //this.SelectedEditTermItems.push({'TermId':element.INT_MIT_ID,'Id': element.INT_ID});
                this.editSelectField(element.INT_ID,element.INT_MIT_ID,element.INT_VALUE,element.TermName);
                this.getOptionsByTermForSelect(element.INT_MIT_ID);
               }
               else  if(element.MIT_TYPE == 3 && element.MIT_ISDEALERSPECIFIC == 'Y'){
                element.selected=true;
                this.SelectedEditTermItems.push({'TermId':element.INT_MIT_ID,'Id': element.INT_ID});
                this.editDealerSpecificField(element.INT_ID,element.INT_MIT_ID,element.INT_VALUE,element.MIT_DISPLAYNAME);
               }
               if(element.MIT_TYPE == 9){
                element.selected=true;
                 this.addDealerInputField(element.INT_ID,element.MIT_DISPLAYNAME)
                 
               }
               if(element.MIT_TYPE==8 && element.MIT_ISDEALERSPECIFIC == 'Y'){
                element.selected=true;
                this.SelectedEditTermItems.push({'TermId':element.INT_MIT_ID,'Id': element.INT_ID});
                this.editDealerSpecificField(element.INT_ID,element.INT_MIT_ID,element.INT_VALUE,element.MIT_DISPLAYNAME);
               }
               else  if(element.MIT_TYPE==8 && element.MIT_ISDEALERSPECIFIC == 'N'){
                  element.selected=true;
                  this.getOptionsByTermForMultiSelect(element) ;                
                 
                 //this.selectedoptionItems.push({id:element.INT_VALUE,itemName:element.OptionName});
                  // if(this.dynamicForm.controls["termMultipleOptionValues"].value.length ==0){
                   
                  //   this.editMultiSelectField(element.INT_ID,element.INT_MIT_ID,element.INT_VALUE,element.OptionName);
                  //   this.getOptionsByTermForMultiSelect(element.INT_MIT_ID);
                  // }
                 
                 
                 // }
                  // if(this.termMultipleOptionValues.length!=0){
                  //   for(var i=0;i<this.termMultipleOptionValues.length;i++)
                  //   this.selectedoptionItems.push({id:element.INT_VALUE,itemName:element.OptionName});
                  // }
                 
                  
               }
               element.selected= this.disabled;
               $('#'+element.INT_MIT_ID).removeClass('cdk-drag-disabled');
               $('#'+element.INT_MIT_ID).addClass('disabled');
              
            }
          );
        }
    })
  }

  /* This method returns the selected items on the original list on left side*/
  getLeftSelectedList(): ListItem[] {
    let leftSelectedList: ListItem[] = [];
    this.originalItems.forEach(
      element => {
        if (element.selected) leftSelectedList.push(element);
      }
    );
    console.log("leftSelectedList",leftSelectedList)

    return leftSelectedList;
  }

  /* This method returns the selected items on the selected list on right side*/
  getRightSelectedList(): ListItem[] {
    let rightSelectedList: ListItem[] = [];
    this.selectedItems.forEach(
      element => {
        if (element.selected) rightSelectedList.push(element);
      }
    );
    console.log("rightSelectedList",rightSelectedList)

    return rightSelectedList;
  }

  /* This method moves items from original list to selected on button click*/
  addItems() {
    this.isSingleClick = false;   
    let count=0;
    for(var i=0;i<this.originalItems.length;i++){
      if(this.originalItems[i].selected==true){
        count++;
    //this.moveItems(this.originalItems, this.selectedItems, 0);
      }
      if(count>0){
        this.globalSelected=false;
        this.moveItems(this.originalItems, this.selectedItems, 0);
      }
      else{
        this.globalSelected=true;
      }
      
    }
    
  }
  addListItems(index){
    this.originalItems[index].selected=true;
    this.globalSelected=false;
    this.moveItems(this.originalItems, this.selectedItems, 0);

  }

  RemoveListItems(i,termid,type){
    if(type=="1"){
     this.originalItems[i].selected=false;
     this.selectedItems.splice(i, 1);
     this.SelectedEditTermItems.splice(i,1);
    }
    if(type=="2"){
      this.termValues.removeAt(i);
    }
    if(type=="3"){
      this.termOptionValues.removeAt(i);
    }
    if(type=="4"){
      this.DealerSpecificTerms.removeAt(i);
    this.SelectedEditTermItems.splice(i,1);
    }
    if(type=="5"){
      this.termMultipleOptionValues.removeAt(i);
      this.dropdownList.splice(i,1);
     delete this.dropdownSettings[i];
    //this.SelectedEditTermItems.splice(i,1);
    }


     $('#'+termid).removeClass('disabled');
     
    if(this.selectedItems.length==0 && this.termValues.length==0 && this.termOptionValues.length==0 && this.DealerSpecificTerms.length==0 && this.termMultipleOptionValues.length==0)
      this.globalSelected=true;
      else
      this.globalSelected=false;
  }
  RemoveDealerSpecificItems(index,termid){
    $('#'+termid).removeClass('disabled');
    this.DealerSpecificTerms.removeAt(index);
    this.SelectedEditTermItems.removeAt(this.SelectedEditTermItems.findIndex(id=>id.termid==termid));
    if(this.selectedItems.length==0 && this.termValues.length==0 && this.termOptionValues.length==0 && this.DealerSpecificTerms.length==0)
    this.globalSelected=true;
    else
    this.globalSelected=false;
  }
  RemoveSelectOptionItems(index,termid){
    $('#'+termid).removeClass('disabled');
    this.termOptionValues.removeAt(index);
    if(this.selectedItems.length==0 && this.termValues.length==0 && this.termOptionValues.length==0 && this.DealerSpecificTerms.length==0)
    this.globalSelected=true;
    else
    this.globalSelected=false;
  }
  RemoveInputItems(index,termid){
    $('#'+termid).removeClass('disabled');
    this.termValues.removeAt(index);
    if(this.selectedItems.length==0 && this.termValues.length==0 && this.termOptionValues.length==0 && this.DealerSpecificTerms.length==0)
    this.globalSelected=true;
    else
    this.globalSelected=false;
  }

  /* This method moves items from selected list to original on button click*/
  removeItems() {
    this.moveItems(this.selectedItems, this.originalItems, 0);
  }

  /*helper method that moves items between lists */
  private moveItems(fromList: ListItem[], toList: ListItem[], insertIndex: number) {
    for (let removeIndex = fromList.length - 1; removeIndex >= 0; removeIndex--) {
      let item: any = fromList[removeIndex];
      if (item.selected) {

         //fromList.splice(removeIndex, 1);
         item.selected= this.disabled;
         $('#'+item.value.MIT_ID).removeClass('cdk-drag-disabled');
         $('#'+item.value.MIT_ID).addClass('disabled');

         if(item.value.MIT_TYPE == 1 && item.value.MIT_ISDEALERSPECIFIC=='N'){
          item.selected = false;
          toList.splice(insertIndex, 0, item);
          this.SelectedTermItems.push(item.value.MIT_ID);

         }
         else  if(item.value.MIT_TYPE == 1 && item.value.MIT_ISDEALERSPECIFIC=='Y'){
          item.selected = false;
          //toList.splice(insertIndex, 0, item);
          this.addDealerInputField(item.value.MIT_ID,item.value.MIT_DISPLAYNAME);
          this.SelectedTermItems.push(item.value.MIT_ID);

         }
         else if(item.value.MIT_TYPE == 2 && item.value.MIT_ISDEALERSPECIFIC=='Y'){
          
          item.selected = false;
          //toList.splice(insertIndex, 0, item);
          this.addDealerInputField(item.value.MIT_ID,item.value.MIT_DISPLAYNAME);
          this.SelectedTermItems.push(item.value.MIT_ID);
        }
        else if(item.value.MIT_TYPE == 2  && item.value.MIT_ISDEALERSPECIFIC=='N'){
          
          item.selected = false;
          //toList.splice(insertIndex, 0, item);
          this.addInputField(item.value.MIT_ID,item.value.MIT_DISPLAYNAME)
        }
        else if(item.value.MIT_TYPE == 9){
          
          item.selected = false;
          //toList.splice(insertIndex, 0, item);
          this.addDealerInputField(item.value.MIT_ID,item.value.MIT_DISPLAYNAME);
          this.SelectedTermItems.push(item.value.MIT_ID);
        }
        else if(item.value.MIT_TYPE == 3 && item.value.MIT_ISDEALERSPECIFIC=='N'){
          
          item.selected = false;
          //toList.splice(insertIndex, 0, item);
          // if(this.termOptionValues.controls.length > 0)
          // for(var i=0;i< this.termOptionValues.controls.length;i++){
          // this.addSelectField();
          // this.getOptionsByTerm(item.value.tac_Id,i);
          // }
          // else{
            this.addSelectField(item.value.MIT_ID, item.value.MIT_DISPLAYNAME);
            this.getOptionsByTermForSelect(item.value.MIT_ID);
          //}
        }
        else if(item.value.MIT_TYPE == 3 && item.value.MIT_ISDEALERSPECIFIC=='Y'){
          
          item.selected = false;
          this.addDealerInputField(item.value.MIT_ID,item.value.MIT_DISPLAYNAME);
          this.SelectedTermItems.push(item.value.MIT_ID);
        }
        else if(item.value.MIT_TYPE == 8 && item.value.MIT_ISDEALERSPECIFIC=='Y'){
          
          item.selected = false;
          this.addDealerInputField(item.value.MIT_ID,item.value.MIT_DISPLAYNAME);
          this.SelectedTermItems.push(item.value.MIT_ID);
        }
        else if(item.value.MIT_TYPE == 8 && item.value.MIT_ISDEALERSPECIFIC=='N'){
          
          item.selected = false;
          this.addMultiSelectField(item.value.MIT_ID, item.value.MIT_DISPLAYNAME);
            this.getOptionsByTermMultiSelectAdd(item.value.MIT_ID,item.value.MIT_DISPLAYNAME);
        }
        
        
        
      }
    }
    this.onChange(this.value);
  }
  get termValues(): FormArray {
    return this.dynamicForm.get('termValues') as FormArray;
  }
  get termOptionValues(): FormArray {
    return this.dynamicForm.get('termOptionValues') as FormArray;
  }
  get termMultipleOptionValues(): FormArray {
    return this.dynamicForm.get('termMultipleOptionValues') as FormArray;
  }
  get DealerSpecificTerms():FormArray{
    return this.dynamicForm.get('DealerSpecificTerms') as FormArray;
  }

  addDealerInputField(id,placeholdername){
    //this.RightTermName = placeholdername;
    // this.Dealerfield=true;
    // this.Dealerplaceholder=placeholdername;
  //  this.termValues.push(
  //    this.newInuputQuantity(id,placeholdername)
  //   // new FormControl('', Validators.required)
  //    );
  this.DealerSpecificTerms.push(this.newDealerSpecificQuantity(id,placeholdername));
  }
  editDealerSpecificField(id,termid,value,placeholder){
    this.DealerSpecificTerms.push(this.neweditDealerInputField(id,termid,value,placeholder));
  }
  newDealerSpecificQuantity(termid,termname):FormGroup{
    return this.formBuilder.group({
      identity:'',
      RightTermName:termname,
      ds:new FormControl(''),
      termid:[termid]
    })

  }
  neweditDealerInputField(id,termid,value,placeholder){
     return this.formBuilder.group({
      identity:id,
      RightTermName:placeholder,
      ds:new FormControl(''),
      termid:[termid]
    });
  }
  showErrorMessage(){
    this.alertify.success('Dealer will Submit Details')
    //this.editable=!this.editable;
  }

  addInputField(id,placeholdername){
    //this.RightTermName = placeholdername;
   this.termValues.push(
     this.newInuputQuantity(id,placeholdername)
    // new FormControl('', Validators.required)
     );
  }
  editInputField(id,termid,value,placeholder){
    this.termValues.push(
      this.newEditInuputQuantity(id,termid,value,placeholder)
     // new FormControl('', Validators.required)
      );
  }
  addSelectField(id, termname){
    this.termOptionValues.push(this.newSelectQuantity(id,termname));
    
  }
   editSelectField(id,termid,val,termname){
    this.termOptionValues.push(this.newEditSelectQuantity(id,termid,val,termname));
    
  }
  addMultiSelectField(id,termname){
    this.termMultipleOptionValues.push(this.newMultiSelectQuantity(id,termname));
  }
  editMultiSelectField(id,termid,value,termname){
    this.termMultipleOptionValues.push(this.editMultiSelectQuantity(id,termid,value,termname) );
  }
  newInuputQuantity(termid,termname): FormGroup {
    return this.formBuilder.group({
      identity:'',
      RightTermName:termname,
      idx:new FormControl('',Validators.required),
      termid:[termid]
    });
  }
  newEditInuputQuantity(id,termid,termvalue,placeholder): FormGroup {
    return this.formBuilder.group({
      identity:id,
      RightTermName:placeholder,
      idx:termvalue,
      termid:[termid]
    });
  }
  newSelectQuantity(termid,termplaceholder): FormGroup {
    return this.formBuilder.group({
      identity:'',
      placeholder:termplaceholder,
      controlid:['',Validators.required],
      termid:[termid]
    });
  }
  newEditSelectQuantity(id,termid,value,termplaceholder): FormGroup {
    return this.formBuilder.group({
      identity:id,
      placeholder:termplaceholder,
      controlid:value,
      termid:[termid]
    });
  }
  newMultiSelectQuantity(termid,termname):FormGroup{
    return this.formBuilder.group({
      identity:'',
      placeholder:termname,
      multicontrolid:['',Validators.required],
      termid:[termid]
    });
  }
  editMultiSelectQuantity(id,termid,value,termname):FormGroup{
    return this.formBuilder.group({
      identity:id,
      placeholder:termname,
      multicontrolid:value,
      termid:[termid]
    });
  }
  
  cnt:any=0;
  getOptionsByTermForSelect(termid){
     //this.termsOptions=[];
      const obj = { "TermID": termid,"expression": ""}
      this.ApiService.postmethod('termsandconditions/incentivetermoptions',obj).subscribe((res:any)=>{
        console.log(res);
        if(res.status == 200){
          if(res.response[0].MIT_ID == termid){
             this.termsOptions[this.cnt] = res.response;
           
             this.cnt++;
          }
          console.log(this.termsOptions);
   
         
             
        }
       
      })
   }

   getOptionsByTermMultiSelectAdd(termid,termname){
     //this.selectedoptionItems=[];
    this.termsMultipleOptions=[];
    const obj = { "TermID": termid,"expression": ""}
    this.ApiService.postmethod('termsandconditions/incentivetermoptions',obj).subscribe((res:any)=>{
      console.log(res);
      if(res.status == 200){
        if(res.response[0].MIT_ID == termid){
           this.termsMultipleOptions[this.multicnt] = res.response;
           let arr = [];
           this.termsMultipleOptions[this.multicnt].forEach((element :any)=> {
             console.log(element)
           arr.length === 0 ?
            (arr = [{ id: element.to_id, itemName: element.to_Name }]) : (arr.push({ id: element.to_id, itemName: element.to_Name }));
           });
           if(this.termMultipleOptionValues.length > 0){

           }
           this.dropdownList[this.termMultipleOptionValues.length-1] = arr;
           this.dropdownSettings[this.termMultipleOptionValues.length-1]={text:'select ('+termname+')', badgeShowLimit:1}
          // console.log("ddl",this.dropdownList)
           this.multicnt++;
        }
       // console.log(this.termsMultipleOptions);

       
           
      }
     
    });
   }
multicnt:any=0;
 error = false;
getOptionsByTermForMultiSelect(element){
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{
      if(this.error){
        reject('error');
      }
      else{
      this.termsMultipleOptions=[];
      var termid=element.INT_MIT_ID;
      const obj = { "TermID": termid,"expression": ""}
      this.ApiService.postmethod('termsandconditions/incentivetermoptions',obj).subscribe((res:any)=>{
        console.log(res);
        if(res.status == 200){
          if(res.response[0].MIT_ID == termid){
             this.termsMultipleOptions[this.multicnt] = res.response;
             let arr = [];
             this.termsMultipleOptions[this.multicnt].forEach((element :any)=> {
               console.log(element)
             arr.length === 0 ?
              (arr = [{ id: element.to_id, itemName: element.to_Name }]) : (arr.push({ id: element.to_id, itemName: element.to_Name }));
             });
             this.dropdownList[this.multicnt] = arr;
             this.dropdownSettings = { 
              singleSelection: false, 
              text:"Check",  
              selectAllText:'Select All',
              unSelectAllText:'UnSelect All',
              enableSearchFilter: true,
              classes:"myclass custom-class",
              primaryKey:"id",
              badgeShowLimit:1
              // showCheckbox:true,
              // maxHeight:600,
              // badgeShowLimit:3
            };


            // console.log("ddl",this.dropdownList)
            
          }
          console.log(this.termsMultipleOptions);
  
          if(element.OptionValue.indexOf(',')!==-1){

            let editlist=[];
            var optionlen = element.OptionValue.split(',');
                for(var i=0;i<optionlen.length;i++)
              editlist.push({id:parseInt(optionlen[i].split('@')[0]),itemName:optionlen[i].split('@')[1]});

              this.selectedoptionItems.splice(this.multicnt,0,editlist );
              this.editMultiSelectField(element.INT_ID,element.INT_MIT_ID,element.INT_VALUE,element.OptionName);
             
           }
           else{
            let editlist=[];
            editlist.push({id:parseInt(element.OptionValue.split('@')[0]),itemName:element.OptionValue.split('@')[1]});
            this.selectedoptionItems.splice(this.multicnt,0,editlist );
            this.editMultiSelectField(element.INT_ID,element.INT_MIT_ID,element.INT_VALUE,element.OptionName);
           }
           this.multicnt++; 
        }
       
      });
     // resolve(this.dropdownList);
    }
    },1000)
    
   
  
});
}


  /*This method handles the drag event onto selected list on the right */
  dragOntoRightItems(event) {
    if (event.previousContainer === event.container) {
      if (this.sort && this.getRightSelectedList().length == 1 && this.selectedItems.length > 1) {
        this.changeItemPosition(this.selectedItems, event.previousIndex, event.currentIndex);
      }
    } else {
      this.moveItems(this.originalItems, this.selectedItems, event.currentIndex);
    }
  }

  /*This method handles the drag event onto original list on the left */
  dragOntoLeftItems(event) {
    if (event.previousContainer === event.container) {
      if (this.sort && this.getLeftSelectedList().length == 1 && this.originalItems.length > 1) {
        this.changeItemPosition(this.originalItems, event.previousIndex, event.currentIndex);
      }
    } else {
      this.moveItems(this.selectedItems, this.originalItems, event.currentIndex);
    }
  }

  /* helper method that changes the position of items in the list*/
  private changeItemPosition(list: ListItem[], currPos: number, newPos: number) {
    let item: ListItem = list.splice(currPos, 1)[0];
    item.selected = false;
    list.splice(newPos, 0, item);
    this.onChange(this.value);
  }

  /*This method handles selected all check box on the orignal list on left side */
  selectAllOnLeft(event) {
    this.changeSelection(this.originalItems, event.currentTarget.checked);
  }

  /*This method handles selected all check box on the selected list on right side */
  selectAllOnRight(event) {
    this.changeSelection(this.selectedItems, event.currentTarget.checked);
  }

  /*helper method that handles selected all checkbox */
  private changeSelection(list: ListItem[], val: boolean): void {
    list.forEach(
      element => {
        if (val) element.selected = true;
        else element.selected = false;
      }
    );
  }


  get value(): any {
    let temp: string[] = [];
    this.selectedItems.forEach(
      element => {
        temp.push(element.value);
      }
    );
    return temp;
  }

  set value(val: any) {
    this.setSelectedValues(val);
  }

  setSelectedValues(values: string[]) {
    if (values !== undefined && values != null && values != []) {
      this.selectedList = values;
      if (this.selectedList.length > 0) {
        //Add to items selected items working list
        this.selectedList.forEach(
          element => {
            const item: ListItem = new ListItem(element);
            this.selectedItems.push(item);
          }
        );

        //remove from original items working list
        for (let delIndex = this.originalItems.length - 1; delIndex >= 0; delIndex--) {
          let item: ListItem = this.originalItems[delIndex];
          if (this.selectedList.indexOf(item.value) > -1) {
            this.originalItems.splice(delIndex, 1);
          }
        }
      }

    }

  }

  /* Methods to implement ControlValueAccessor */
  onChange = (val: string[]) => { };
  onTouched = () => { };
  writeValue(value: string[]): void {
    this.setSelectedValues(value);
    this.onChange(this.value);
  }
  registerOnChange(fn: (val: string[]) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  emitCount:number=0;
  termIndex:number=0;
  OnSubmit(){
    this.termIndex=0;
    this.submitted = true;
    if (this.dynamicForm.invalid) {
      return
    }
    if(this.emitCount == 0){
    
    this.ComponentFinalArray=[];
    console.log(this.dynamicForm.value);
    if(this.dynamicForm.value.termOptionValues.length > 0){
     
      for(var i=0;i<this.dynamicForm.value.termOptionValues.length;i++){
        if(this.editList=="" &&  this.dynamicForm.value.termOptionValues[i].identity == "")
            this.ComponentFinalArray.push({'tcd_tac_id' : this.dynamicForm.value.termOptionValues[i].termid,'tcd_value' : this.dynamicForm.value.termOptionValues[i].controlid,'tcd_inm_id' : this.incentiveid,'tcd_status':'Y','index':this.termIndex});
        else  if(this.editList=="Edit" &&  this.dynamicForm.value.termOptionValues[i].identity == "")
        this.ComponentFinalArray.push({'tcd_tac_id' : this.dynamicForm.value.termOptionValues[i].termid,'tcd_value' : this.dynamicForm.value.termOptionValues[i].controlid,'tcd_inm_id' : this.incentiveid,'tcd_status':'Y','action': 'A','index':this.termIndex});
        else  if(this.editList=="Edit" &&  this.dynamicForm.value.termOptionValues[i].identity != "")
        this.ComponentFinalArray.push({'tcd_tac_id' : this.dynamicForm.value.termOptionValues[i].termid,'tcd_value' : this.dynamicForm.value.termOptionValues[i].controlid,'tcd_inm_id' : this.incentiveid,'tcd_id':this.dynamicForm.value.termOptionValues[i].identity,'tcd_status':'Y','action': 'A','index':this.termIndex});
        this.termIndex++;
      }
    }
    if(this.dynamicForm.value.termMultipleOptionValues.length > 0){
     
      for(var l=0;l<this.dynamicForm.value.termMultipleOptionValues.length;l++){
        if(this.editList=="" &&  this.dynamicForm.value.termMultipleOptionValues[l].identity == ""){
          if(this.dynamicForm.value.termMultipleOptionValues[l].multicontrolid.length !=0){
              for(var m=0;m<this.dynamicForm.value.termMultipleOptionValues[l].multicontrolid.length;m++){
                this.ComponentFinalArray.push({'tcd_tac_id' : this.dynamicForm.value.termMultipleOptionValues[l].termid,'tcd_value' : this.dynamicForm.value.termMultipleOptionValues[l].multicontrolid[m].id,'tcd_inm_id' : this.incentiveid,'tcd_status':'Y','index':this.termIndex});
                this.termIndex++;
              }
          }
          else{
            this.ComponentFinalArray.push({'tcd_tac_id' : this.dynamicForm.value.termMultipleOptionValues[l].termid,'tcd_value' : this.dynamicForm.value.termMultipleOptionValues[l].multicontrolid.id,'tcd_inm_id' : this.incentiveid,'tcd_status':'Y','index':this.termIndex});
            this.termIndex++;
          }
        }
        else if(this.editList=="Edit" &&  this.dynamicForm.value.termMultipleOptionValues[l].identity == ""){
          if(this.dynamicForm.value.termMultipleOptionValues[l].multicontrolid.length !=0){
            for(var n=0;n<this.dynamicForm.value.termMultipleOptionValues[l].multicontrolid.length;n++){
              this.ComponentFinalArray.push({'tcd_tac_id' : this.dynamicForm.value.termMultipleOptionValues[l].termid,'tcd_value' : this.dynamicForm.value.termMultipleOptionValues[l].multicontrolid[n].id,'tcd_inm_id' : this.incentiveid,'tcd_status':'Y','action': 'A','index':this.termIndex});
              this.termIndex++;
            }
        }
        else{
          this.ComponentFinalArray.push({'tcd_tac_id' : this.dynamicForm.value.termMultipleOptionValues[l].termid,'tcd_value' : this.dynamicForm.value.termMultipleOptionValues[l].multicontrolid.id,'tcd_inm_id' : this.incentiveid,'tcd_status':'Y','action': 'A','index':this.termIndex});
          this.termIndex++;
        }
        }
        else if(this.editList=="Edit" &&  this.dynamicForm.value.termMultipleOptionValues[l].identity != ""){
          if(this.dynamicForm.value.termMultipleOptionValues[l].multicontrolid.length !=0){
            for(var h=0;h<this.dynamicForm.value.termMultipleOptionValues[l].multicontrolid.length;h++){
              this.ComponentFinalArray.push({'tcd_tac_id' : this.dynamicForm.value.termMultipleOptionValues[l].termid,'tcd_value' : this.dynamicForm.value.termMultipleOptionValues[l].multicontrolid[h].id,'tcd_inm_id' : this.incentiveid,'tcd_id':this.dynamicForm.value.termMultipleOptionValues[l].identity,'tcd_status':'Y','action': 'A','index':this.termIndex});
              this.termIndex++;
            }
        }
        else{
          this.ComponentFinalArray.push({'tcd_tac_id' : this.dynamicForm.value.termMultipleOptionValues[l].termid,'tcd_value' : this.dynamicForm.value.termMultipleOptionValues[l].multicontrolid.id,'tcd_inm_id' : this.incentiveid,'tcd_id':this.dynamicForm.value.termMultipleOptionValues[l].identity,'tcd_status':'Y','action': 'A','index':this.termIndex});
          this.termIndex++;
        }
        }
    
       // this.termIndex++;
      }
    }
    if(this.dynamicForm.value.termValues.length > 0){
     
      for(var j=0;j<this.dynamicForm.value.termValues.length;j++){
        if(this.editList=="" &&  this.dynamicForm.value.termValues[j].identity == "")
          this.ComponentFinalArray.push({'tcd_tac_id' : this.dynamicForm.value.termValues[j].termid,'tcd_value' : this.dynamicForm.value.termValues[j].idx,'tcd_inm_id' : this.incentiveid,'tcd_status':'Y','index':this.termIndex});
        else if(this.editList=="Edit" &&  this.dynamicForm.value.termValues[j].identity == "")
        this.ComponentFinalArray.push({'tcd_tac_id' : this.dynamicForm.value.termValues[j].termid,'tcd_value' : this.dynamicForm.value.termValues[j].idx,'tcd_inm_id' : this.incentiveid,'tcd_status':'Y','action':'A','index':this.termIndex});  
        else if(this.editList=="Edit" &&  this.dynamicForm.value.termValues[j].identity != "")
        this.ComponentFinalArray.push({'tcd_tac_id' : this.dynamicForm.value.termValues[j].termid,'tcd_value' : this.dynamicForm.value.termValues[j].idx,'tcd_inm_id' : this.incentiveid,'tcd_id': this.dynamicForm.value.termValues[j].identity,'tcd_status':'Y','action':'A','index':this.termIndex});  
        this.termIndex++;
      }
    }
    if(this.SelectedEditTermItems.length != 0){
    if(this.editList=="Edit"){
      for(var k=0;k<this.SelectedEditTermItems.length;k++){
        this.ComponentFinalArray.push({'tcd_tac_id' : this.SelectedEditTermItems[k].TermId,'tcd_value' : '','tcd_inm_id' : this.incentiveid,'tcd_status':'Y','tcd_id' : this.SelectedEditTermItems[k].Id,'action':'A','index':this.termIndex});
        this.termIndex++;
      }
    }
  }
    
   // else{
     if(this.SelectedTermItems.length!=0) {
    for(var k=0;k<this.SelectedTermItems.length;k++){
      this.ComponentFinalArray.push({'tcd_tac_id' : this.SelectedTermItems[k],'tcd_value' : '','tcd_inm_id' : this.incentiveid,'tcd_status':'Y','action' : 'A','index':this.termIndex});
      this.termIndex++;
    }

  }
  // }
     this.FinalArray.emit(this.ComponentFinalArray);
     this.emitCount++;
    //  this.ComponentFinalArray.forEach(element => {
      
    //      this.selectedTermIds = this.selectedTermIds.filter(t1=>t1!= element.tcd_tac_id)
    //  });
    //  console.log(this.selectedTermIds)
  }
    
  }

  OnCancelTerms(){

    this.globalSelected=true;
    this.selectedItems=[];
    this.editList="";
    this.TermCancelClick.emit(true);
  }

}
