import { element } from 'protractor';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ListItem } from '../../../Core/_models/list-item.domain';
import { ApiService } from '../../../Core/_providers/api-service/api.service';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { AlertifyService } from '../../../Core/_providers/alert-service/alertify.service';
import { ModalDialogService } from '../../../Shared/modal-dialog/modal-dialog.service';
import { NgxSpinnerService } from "ngx-spinner";

declare var $: any;

@Component({
  selector: 'app-drag-n-drop',
  templateUrl: './drag-n-drop.component.html',
  styleUrls: ['./drag-n-drop.component.scss']
})
export class DragNDropComponent implements OnInit {

  @Input('variablesList') variablesList: any = [];
  @Input('lineItemsInfo') lineItemsInfo: any = [];
  selectedVarList: any = [];


  /* option to  turn on sort feature on the lists*/
  @Input() sort;
  /* option to turn on search feature on the lists */
  @Input() search;
  /* option to turn on select/unselect all feature on the lists*/
  @Input() selectAll;
  /* option to disable the component*/
  @Input() disabled: boolean = false;
  @Output() public FinalArray = new EventEmitter<any>();
  @Output() xButtonClick: EventEmitter<boolean> = new EventEmitter<boolean>();

  /* filter text used to filter items on the left side */
  leftFilterText: string = '';
  /* filter text used to filter items on the right side */
  rightFilterText: string = '';

  /* working list of items on the left side */
  originalItems: ListItem[] = [];
  /* working list of items on the right side */
  selectedItems: ListItem[] = [];

  mdlSlctdValues: any = [];
  yearSlctdValues: any = [];
  stylSlctdValues: any = [];
  stylExcSlctdValues: any = [];
  alphaColumns: any = ["Varbl_Display_Name"];


  /* selected items that will be passed back to form control */
  @Input('value') selectedList: any = [];
  @Input('incentiveName') glbIncentiveName: string = "";
  @Input('incentiveType') glbIncentiveType: string = "";
  constructor(private ApiService: ApiService, private formBuilder: FormBuilder, private alertify: AlertifyService, private apiSrvc: ApiService,
    private modalSrvc: ModalDialogService, private SpinnerService: NgxSpinnerService) {

  }

  detailsFormGroup: FormGroup;
  detailOptions: any = [];
  detailModelOptions: any = [];
  selectedDetailsItems: any = [];
  componentFinalArray: any = [];
  lineHeader: any = [];
  tierInfo: any = [];
  _glbDetailCnt: number = 0;
  _glbInputCounter: number = 0;
  _glbSelectCounter: number = 0;
  _glbSelectEnabled: boolean = false;
  _addCnt: number = 0;
  _glbYear: number = 2021; _glbStyleExc: number = 0; _glbStyleInc: number = 0;
  _glbFormSubmitted: boolean = false;
  ddlTierOption: any = [];
  _glbEnableTier: boolean = false;
  tierBtn: boolean = false;
  tierBtn1: boolean = false;
  _selectTier: boolean = false;
  _glbTierVarId: number = 0; _glbUnitVarId: number = 0; _glbMsrpVarId: number = 0;
  _updtTierValue: string = ""; _updtUnitPriceVal: string = ""; _updtMsrpVal: string = "";
  _glbLineHdrName: string = ""; itemExists: boolean = false;
  _mdlIncSlctd: boolean = false; _mdlExcSlctd: boolean = false; _stylIncSlctd: boolean = false; _stylExcSlctd: boolean = false;
  _yearSlctd: boolean = false; _glbModelId: number = 0; _regionSlctd: boolean = false;
  _itemsUpdated: boolean = false; _enableRightDrag: boolean = false;
  _removeItem: boolean = false; _saleTypeSelect: boolean = false;
  multiDropSlctValues: any = [];
  dropdownSettings = {};_glbDraggedTypeId: number=0;

  // multiArrayItems: {
  //   detailId: number;
  //   detailName: string;
  //   dataType:string;
  // }[];




  ngOnInit(): void {

    this.getLineItemCount(this.lineItemsInfo["incentiveId"]);

    if (this.lineItemsInfo["viewType"] === 'U') {
      this.getLineItemById(this.lineItemsInfo["lineHdrId"]);
    }
    

   
    this.variablesList.forEach(element => {
      $('#' + element.Varbl_Unique_Id).removeClass('disabled');
      this.originalItems.push(new ListItem(element));
    });


    this._glbDetailCnt++;
   
    this.detailsFormGroup = this.formBuilder.group({
      tierUnitPrice: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      tierMSRP: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      LineHeader: "",
      detailTierOption: ['', ''],
      detailsValues: new FormArray([]),
      detailsOptionValues: new FormArray([]),
      detailsMultiOptionValues: new FormArray([])
     
    })

    this.multiDropSlctValues = [];
    this.dropdownSettings = {
      singleSelection: false,
      text: 'Select',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: 'myclass custom-class',
      primaryKey: "id",
      badgeShowLimit: 1
      //lazyLoading : true
    };


    if (this.selectedList != null && this.selectedList != []) {
      this.setSelectedValues(this.selectedList);
      this.onChange(this.value);
    }
  }


  get detailsValues(): FormArray {
    return this.detailsFormGroup.get('detailsValues') as FormArray;
  }
  get detailsOptionValues(): FormArray {
    return this.detailsFormGroup.get('detailsOptionValues') as FormArray;
  }

  get detailsMultiOptionValues(): FormArray {
    return this.detailsFormGroup.get('detailsMultiOptionValues') as FormArray;
  }

  get detailModIncOptionValues(): FormArray {
    return this.detailsFormGroup.get('detailModIncOptionValues') as FormArray;
  }

  get detailModExcOptionValues(): FormArray {
    return this.detailsFormGroup.get('detailModExcOptionValues') as FormArray;
  }

  get detailStyIncOptionValues(): FormArray {
    return this.detailsFormGroup.get('detailStyIncOptionValues') as FormArray;
  }

  get detailStyExcOptionValues(): FormArray {
    return this.detailsFormGroup.get('detailStyExcOptionValues') as FormArray;
  }

  get detailYearOptionValues(): FormArray {
    return this.detailsFormGroup.get('detailYearOptionValues') as FormArray;
  }


  addInputField(id, varblId, name, dataType, data, isDealer) {

    this._glbInputCounter++;
    this.detailsValues.push(this.newInputQuantity(id, varblId, name, dataType, data, isDealer)
      // new FormControl('', Validators.required)
    );
  }

  addSelectField(id, varblId, name, dataType, data, isDealer) {

    this.detailsOptionValues.push(this.newSelectQuantity(id, varblId, name, dataType, data, isDealer));

  }
  addMultiSelectFields(id, varblId, name, dataType, data, isDealer) {

    this.detailsMultiOptionValues.push(this.newSelectQuantity(id, varblId, name, dataType, data, isDealer));
  }


  addDynmicSelectFields(id, varblId, name, dataType, data, isDealer) {
    console.log("addDynamicField" + id);
    if (id === 1002) {
      this.detailModIncOptionValues.push(this.newSelectQuantity(id, varblId, name, dataType, data, isDealer));

    }
    if (id === 1003) {
      this.detailModExcOptionValues.push(this.newSelectQuantity(id, varblId, name, dataType, data, isDealer));

    }
    if (id === 1004) {
      this.detailStyIncOptionValues.push(this.newSelectQuantity(id, varblId, name, dataType, data, isDealer));

    }
    if (id === 1005) {
      this.detailStyExcOptionValues.push(this.newSelectQuantity(id, varblId, name, dataType, data, isDealer));

    }
    if (id === 1001) {
      this.detailYearOptionValues.push(this.newSelectQuantity(id, varblId, name, dataType, data, isDealer));
    }
  }

  newInputQuantity(detailId, varblId, detailName, dataType, data, isDealer): FormGroup {
    return this.formBuilder.group({
      idx: new FormControl('', Validators.required),
      detailId: [detailId],
      varblId: [varblId],
      detailName: [detailName],
      dataType: [dataType],
      data: data,
      selected: false,
      isDealerSpec: isDealer

    });
  }
  newSelectQuantity(detailId, varblId, detailName, dataType, data, isDealer): FormGroup {
    return this.formBuilder.group({
      controlid: ['', Validators.required],
      detailId: [detailId],
      varblId: [varblId],
      detailName: [detailName],
      dataType: [dataType],
      data: data,
      selected: false,
      isDealerSpec: isDealer

    });
  }

  dropVariables(event: CdkDragDrop<string[]>) {
    //moveItemInArray(this.variablesList, event.previousIndex, event.currentIndex);
    {
      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
        transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
      }
    }
  }

  /* This method returns the selected items on the original list on left side*/
  getLeftSelectedList(): ListItem[] {
    let leftSelectedList: ListItem[] = [];
    this.originalItems.forEach(
      element => {
        if (element.selected) leftSelectedList.push(element);
      }
    );
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


    return rightSelectedList;
  }

  _addItem: boolean = false;
  /* This method moves items from original list to selected on button click*/
  addItems() {

    // if (!this._tierSelected && !this._unitSelected && !this._msrpSelected) {
    //   this.alertify.error("Please select either Tier or Unit Price or MSRP");
    //   return false;
    // }
    // else if(!this._yearSelected){
    //   this.alertify.error("Please select Year");
    //   return false;
    // }
    // else {
    this._glbSelectEnabled = true;
    this._addItem = true;
    this._removeItem = false;
    //this._dynmcCntrlClkd=true;
    this._stylExcSlctd = false;
    this._mdlIncSlctd = false;
    this._mdlExcSlctd = false;
    this._yearSlctd = false;
    this._regionSlctd = false;
    this.moveItems(this.originalItems, this.selectedItems, 0);
    let sortMultiOption = this.detailsMultiOptionValues.value;
    sortMultiOption.sort((l1, l2): number => {
      if (l1.detailId < l2.detailId) return -1;
      if (l1.detailId > l2.detailId) return 1;
      return 0;
    });

    this.detailsMultiOptionValues.patchValue(sortMultiOption);


    // }

  }

  addListItems(detailId, index) {
    this.SpinnerService.show(); 
    let _itemSelected: boolean = false;
    this._removeItem = false;

  
    if (detailId === 1001) {
      this._yearSelected = !this._yearSelected;
      this.disabled = false;
      _itemSelected = this._yearSelected;
    }
    else if (detailId === 1002) {

      if (!this._modalExcSelected) {
        this._modalIncSelected = !this._modalIncSelected;
        _itemSelected = this._modalIncSelected;
        this.disabled = false;
      }
      else {
        this.disabled = true;
        this.alertify.error("You can select either Model Include or Model Exclude");

      }

    }
    else if (detailId === 1003) {

      if (!this._modalIncSelected) {
        this._modalExcSelected = !this._modalExcSelected;
        _itemSelected = this._modalExcSelected;
        this.disabled = false;
      }
      else {
        this.disabled = true;
        this.alertify.error("You can select either Model Include or Model Exclude");

      }

    }
    else if (detailId === 1004) {

      if(!this._modalIncSelected && !this._modalExcSelected){
        this.disabled = true;
        this.alertify.error("Please select either Model Include or Model Exclude");
      }
      else{
      if (!this._styleExcSelected) {
        this._styleIncSelected = !this._styleIncSelected;
        _itemSelected = this._styleIncSelected;
        this.disabled = false;
      }
      else {
        this.disabled = true;
        this.alertify.error("You can select either Style Include or Style Exclude");

      }
    }

    }
    else if (detailId === 1005) {

      if(!this._modalIncSelected && !this._modalExcSelected){
        this.disabled = true;
        this.alertify.error("Please select either Model Include or Model Exclude");
      }
      else{
      if (!this._styleIncSelected) {
        this._styleExcSelected = !this._styleExcSelected;
        _itemSelected = this._styleExcSelected;
        this.disabled = false;
      }
      else {
        this.disabled = true;
        this.alertify.error("You can select either Style Include or Style Exclude");
      }
    }

    }
    else {
      this.disabled = false;
      this._detailSelected = !this._detailSelected;
      _itemSelected = this._detailSelected;
    }

    if (!this.disabled) {
      this._glbSelectEnabled = true;
      this._addItem = true;
     
      this.originalItems[index].selected = true;
      this.moveItems(this.originalItems, this.selectedItems, 0);
      
      
    }
    else{
      this.SpinnerService.hide(); 
    }
    //$('#'+detailId+' div').removeClass('selected');
   
  }

  /* This method moves items from selected list to original on button click*/
  removeItems(index) {


    if (this.lineItemsInfo["viewType"] === "U") {
      this._itemsUpdated = false;
     
      let indices: any = [];
      this.detailsMultiOptionValues.controls = [];
      for (let i = 0; i < this.updateLineItems.length; i++) {
        if (this.updateLineItems[i].Varbl_Unique_Id === this._glbDraggedId) {
          indices.push(i);
        }
      }
      for (let j = 0; j < indices.length; j++) {
        this.updateLineItems.splice(indices[j], 1);
      }
    }


    this._addItem = false;
    //this._dynmcCntrlClkd=true;
    this._stylExcSlctd = false;
    this._mdlIncSlctd = false;
    this._mdlExcSlctd = false;
    this._yearSlctd = false;
    this._regionSlctd = false;

    this._removeItem = true;

    if (this._glbDraggedId === 1002)
      this._modalIncSelected = false;
    if (this._glbDraggedId === 1003)
      this._modalExcSelected = false;
    if (this._glbDraggedId === 1004)
      this._styleIncSelected = false;
    if (this._glbDraggedId === 1005)
      this._styleExcSelected = false;

      if(this._glbDraggedId === 1001 || this._glbDraggedId === 1002 || this._glbDraggedId === 1003 || this._glbDraggedId === 1004 || this._glbDraggedId === 1005){
        this.multiDropSlctValues[this._glbDraggedId]=[];
        
      }

      if (this._glbDraggedId === 1008) {
        this._updtTierValue = "0";
        $('#1006').removeClass('disabled');
        $('#1007').removeClass('disabled');
        this._tierSelected = false;
        this._glbEnableTier = false;
        this._selectTier = false;
        this.tierBtn = false;
        this.tierBtn1 = false;
        //this.ddlTierOption=["",""];
        this._updtUnitPriceVal="";
        this._updtMsrpVal="";
        this.detailsFormGroup.value.detailTierOption = "";
      }
      
      // this.detailsFormGroup.controls["detailsMultiOptionValues"] = new FormArray([]);
      // this.detailsFormGroup.controls["detailsOptionValues"] = new FormArray([]);
      // this.detailsFormGroup.controls["detailsValues"] = new FormArray([]);
     

     this.detailsFormGroup = this.formBuilder.group({
      tierUnitPrice: this._glbDraggedId === 1008 ? "" : this._updtUnitPriceVal,
      tierMSRP: this._glbDraggedId === 1008 ? "" : this._updtMsrpVal,
      LineHeader: this._glbLineHdrName,
      detailTierOption:this._glbDraggedId === 1008 ?  [""] : this.ddlTierOption,
      detailsValues: new FormArray([]),
      detailsOptionValues: new FormArray([]),
      detailsMultiOptionValues: new FormArray([])
     
    })
     
    this.selectedItems = [];
  
    $('#' + this._glbDraggedId).removeClass('disabled');
    //this.originalItems[index].selected=false;
    this.moveItems(this.originalItems, this.selectedItems, 0);
  }


  /*helper method that moves items between lists */

  private moveItems(fromList: ListItem[], toList: ListItem[], insertIndex: number) {

    let yearList:any=[];

    fromList.forEach(
      element => {

        if (element.value.Varbl_Unique_Id === 1008) {
          this._glbTierVarId = element.value.Varbl_Id;
         
          if (element.selected) {
              this._glbEnableTier = true;

              this.tierBtn = false;
              this.tierBtn1 = false;
                                
          }
          
        }

        if (element.value.Varbl_Unique_Id === 1002 || element.value.Varbl_Unique_Id === 1003) {
          if (element.selected) {

            fromList.forEach(
              subelement => {
                if (subelement.value.Varbl_Unique_Id === 1001)
                  subelement.selected = true;
              })
          }
          
        }


        if (element.value.Varbl_Unique_Id === 1006) {
          this._glbUnitVarId = element.value.Varbl_Id;
         
        }

        if (element.value.Varbl_Unique_Id === 1007) {
          this._glbMsrpVarId = element.value.Varbl_Id;
         
        }

        if (element.value.Varbl_Unique_Id === 1000) {
          if (!element.selected)
            element.selected = true;
        }


      })

    fromList.sort((l1, l2): number => {
      if (l1.value.Varbl_Priority < l2.value.Varbl_Priority) return -1;
      if (l1.value.Varbl_Priority > l2.value.Varbl_Priority) return 1;
      return 0;
    });


    for (let removeIndex = fromList.length - 1; removeIndex >= 0; removeIndex--) {
      let item: any = fromList[removeIndex];

      if (item.selected) {

        // if(this._enableRightDrag){
        //   fromList.splice(removeIndex, 1);
        // }
        //item.selected = false;

        $('#' + item.value.Varbl_Unique_Id).removeClass('cdk-drag-disabled');
        $('#' + item.value.Varbl_Unique_Id).addClass('disabled');
        //$('#1000 div').removeClass('selected');
        $('#' + item.value.Varbl_Unique_Id + ' div').removeClass('selected');

        let itExt: boolean = false; 
        toList.filter((toItem) => {

          if (toItem.value.Varbl_Unique_Id === item.value.Varbl_Unique_Id) {
            itExt = true;
                  
          }
        })

        this.itemExists = itExt;

        if (!this.itemExists) {
          toList.splice(insertIndex, 0, item);


          if (item.value.Varbl_Type === 1) {


            this.selectedDetailsItems.push(item.value.Varbl_Unique_Id);

          }
          else if (item.value.Varbl_Type === 2) {
            if (item.value.Varbl_Unique_Id !== 1000)
              this.addInputField(item.value.Varbl_Unique_Id, item.value.Varbl_Id, item.value.Varbl_Display_Name, item.value.Varbl_Data_Type, item.data, item.value.Varbl_Dealer_Specific)
          }
          else if (item.value.Varbl_Type === 3 || item.value.Varbl_Type === 8) {

            if (item.value.Varbl_Type === 3) {
              if (item.value.Varbl_Unique_Id !== 1008)
                this.addSelectField(item.value.Varbl_Unique_Id, item.value.Varbl_Id, item.value.Varbl_Display_Name, item.value.Varbl_Data_Type, item.data, item.value.Varbl_Dealer_Specific);
              else{
                this.getIncentiveDropdownInfo(item.value.Varbl_Unique_Id,  item.value.Varbl_Id);
              }
            }

            if (item.value.Varbl_Type === 8) {
              this.addMultiSelectFields(item.value.Varbl_Unique_Id, item.value.Varbl_Id, item.value.Varbl_Display_Name, item.value.Varbl_Data_Type, item.data, item.value.Varbl_Dealer_Specific);
              this.getIncentiveDropdownInfo(item.value.Varbl_Unique_Id, item.value.Varbl_Id);

            }
          }
        }


        if (item.value.Varbl_Unique_Id === 1004) {
          this._stylIncSlctd = true;
        }
        if (item.value.Varbl_Unique_Id === 1005) {
          this._stylExcSlctd = true;
        }
        if (item.value.Varbl_Unique_Id === 1002) {
          this._mdlIncSlctd = true;
        }
        if (item.value.Varbl_Unique_Id === 1003) {
          this._mdlExcSlctd = true;
        }
        if (item.value.Varbl_Unique_Id === 1001) {
          this._yearSlctd = true;
        }

        if (item.value.Varbl_Unique_Id === 1011)
          this._regionSlctd = true;
        if (item.value.Varbl_Unique_Id === 1018)
          this._saleTypeSelect = true;

        if (item.value.Varbl_Unique_Id === 1008) {
          if (this.lineItemsInfo["viewType"] === "U") {
            this._selectTier = true;
          }
          this._updtTierValue = item.data;
        }

        if (item.value.Varbl_Unique_Id === 1006) {
          this._updtUnitPriceVal = item.data;
        }
        else if (item.value.Varbl_Unique_Id === 1007) {
          this._updtMsrpVal = item.data;
        }
       else if(item.value.Varbl_Unique_Id === 1001){
        yearList=this.multiDropSlctValues[1001];
       }


      }

      this.onChange(this.value);
    }

   /* Populating dropdowns starts here*/
    if (this.lineItemsInfo["viewType"] === "U") {

      if (this._selectTier) {
        this._updtTierValue= this._updtTierValue;
        if (this._updtUnitPriceVal != "") {
          this.tierBtn = true;
          this.tierBtn1 = false;
        }
        if (this._updtMsrpVal != "") {
          this.tierBtn1 = true;
          this.tierBtn = false;
        }
      }
   
    }
    /* Populating dropdowns ends here*/

    /** Sorting of Selected List Items goes here */
    toList.sort((l1, l2): number => {
      if (l1.value.Varbl_Priority < l2.value.Varbl_Priority) return -1;
      if (l1.value.Varbl_Priority > l2.value.Varbl_Priority) return 1;
      return 0;
    });

   

    this.detailsMultiOptionValues.updateValueAndValidity();
    this.detailsFormGroup.get('detailsMultiOptionValues').setErrors(null); 
    let sortMultiOption = this.detailsMultiOptionValues.value;
    if(this.lineItemsInfo["viewType"]==="U"){
    sortMultiOption.forEach((control) => {
      control.controlid=this.multiDropSlctValues[control.detailId];
    });
  }

    sortMultiOption.sort((l1, l2): number => {
      if (l1.detailId < l2.detailId) return -1;
      if (l1.detailId > l2.detailId) return 1;
      return 0;
    });

    this.detailsMultiOptionValues.patchValue(sortMultiOption);
  
    /** Sorting of Selected List Items ends here */

    this.SpinnerService.hide(); 

  }


  /*This method handles the drag event onto selected list on the right */
  dragOntoRightItems(event) {

    if (event.previousContainer === event.container) {
      if (this.sort && this.getRightSelectedList().length == 1 && this.selectedItems.length > 1) {
        this.changeItemPosition(this.selectedItems, event.previousIndex, event.currentIndex);
      }
    } else {
      this._enableRightDrag = false;
      this.addListItems(this._glbDraggedId, event.previousIndex);
    }

  }

  /*This method handles the drag event onto original list on the left */
  dragOntoLeftItems(event) {
    if (event.previousContainer === event.container) {
      if (this.sort && this.getLeftSelectedList().length == 1 && this.originalItems.length > 1) {
        this.changeItemPosition(this.originalItems, event.previousIndex, event.currentIndex);
      }
    } else {
      this._enableRightDrag = true;
      if (this._glbDraggedId === 1005) {
        this._styleExcSelected = false;
      }
      if (this._glbDraggedId === 1004) {
        this._styleIncSelected = false;
      }
      if (this._glbDraggedId === 1003) {
        this._modalExcSelected = false;
      }
      if (this._glbDraggedId === 1003) {
        this._modalIncSelected = false;
      }
      if (this._glbDraggedId === 1001) {
        this._yearSelected = false;
      }

      this.originalItems.filter((toItem) => {
        if (toItem.value.Varbl_Unique_Id === this._glbDraggedId) {
          toItem.selected = false;
        }
      })
      this.removeItems(event.previousIndex);
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

    const obj = { val: values };
    console.log("Setselected val" + obj);

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
  onChange = (val: string[]) => { 
    console.log("OnChange Val"+val);
  };
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





  _glbcnt: any = 0; _glbModel: number = 0; _mdlIdForStyles: string = "0"; _yearForAll: string = "0";

  getIncentiveDropdownInfo(varId: number,varblId: number) {
    this.SpinnerService.show();
    // return Promise.resolve((() => {
    this._mdlIdForStyles = "0";
    this._yearForAll = "0";
    let ddlInfo = [];

    if (varId === 1002 || varId === 1003 || varId === 1004 || varId === 1005) {
      if(this.multiDropSlctValues[1001] !== undefined){
      if (this.multiDropSlctValues[1001].length > 0) {
        for (let i = 0; i < this.multiDropSlctValues[1001].length; i++) {
          if (this.multiDropSlctValues[1001].length < 2)
            this._yearForAll = this.multiDropSlctValues[1001][i].id;
          else
            this._yearForAll = this._yearForAll + ',' + this.multiDropSlctValues[1001][i].id;
        }
      }
    }
  }

    if (varId === 1004 || varId === 1005) {
      if(this.multiDropSlctValues[1002] !== undefined){
      if (this.multiDropSlctValues[1002].length > 0) {
        for (let i = 0; i < this.multiDropSlctValues[1002].length; i++) {
          if (this.multiDropSlctValues[1002].length < 2)
            this._mdlIdForStyles = this.multiDropSlctValues[1002][i].id;
          else
            this._mdlIdForStyles = this._mdlIdForStyles + ',' + this.multiDropSlctValues[1002][i].id;
        }
      }
    }
     
    if(this.multiDropSlctValues[1003] !== undefined){
      if (this.multiDropSlctValues[1003].length > 0) {
        for (let i = 0; i < this.multiDropSlctValues[1003].length; i++) {
          if (this.multiDropSlctValues[1003].length < 2)
            this._mdlIdForStyles = this.multiDropSlctValues[1003][i].id;
          else
            this._mdlIdForStyles = this._mdlIdForStyles + ',' + this.multiDropSlctValues[1003][i].id;
        }
      }
    }
    }


    const obj = {
      "reffrncId": varId,
      "varblId" : varblId,
      "year": this._yearForAll,
      "make": this.lineItemsInfo["brandId"],
      "model": this._mdlIdForStyles
    }


    this.ApiService.postmethod('incentivemaster/getdropdownInfo', obj).subscribe((res: any) => {

      if (res.status === 200) {
        if (res.response !== null) {
          if (res.response.length !== 0) {

            if (res.response[0].VarRfrncId === varId) {
            
              ddlInfo = res.response;

              let arr = [];
              ddlInfo.forEach((element) => {

                arr.length === 0
                  ? (arr = [{ id: element.DropdownValue, itemName: element.DropdownName }])
                  : arr.push({
                    id: element.DropdownValue,
                    itemName: element.DropdownName,
                  });

                  if(this.lineItemsInfo['viewType'] === "U"){
                    if(this.multiDropSlctValues[varId] !== undefined){
                     for(let i=0;i<this.multiDropSlctValues[varId].length;i++){
                      
                          if(this.multiDropSlctValues[varId][i].id === element.DropdownValue.toString()){
                            this.multiDropSlctValues[varId][i].id = element.DropdownValue;
                            this.multiDropSlctValues[varId][i].itemName = element.DropdownName;
                          }
                        }
                    }
                    
                  }
              });

              if (varId === 1008){
                this.ddlTierOption = res.response;
                this._updtTierValue = this._updtTierValue;
              }
              else
                this.detailOptions[varId] = arr;
              this._glbcnt++;
              this.SpinnerService.hide(); 

            }
          }
          else {
            this.detailOptions[varId] = [];
          }
        }
        else {
          this.detailOptions[varId] = [];
        }


      }
    })

    //   return;

    // })());this._stylIncSlctd = false;



  }



  emitCount: number = 0; _glbDisableAll: boolean = false; _glbIsSaved: boolean = false;
  onDetailsSubmit() {
    this._glbFormSubmitted = true;

    if (this.detailsFormGroup.value.detailsValues.length > 0) {
      this.detailsFormGroup.value.detailsValues.forEach(element => {
        if (element.detailId !== 1012) {
          if (this.detailsFormGroup.controls['detailsValues'].invalid) {
            this.alertify.error("Please fill the TextFields");
            this.emitCount++;
            return;
          }
        }
      })
    }

    if (this.detailsFormGroup.controls['detailsMultiOptionValues'].invalid) {
      this.alertify.error("Please Select Options");
      this.emitCount++;
      return;
    }
    else {
      if (this.detailsFormGroup.value.detailsMultiOptionValues.length > 0) {
        this.detailsFormGroup.value.detailsMultiOptionValues.forEach(element => {
          if(this.multiDropSlctValues.length>0){
          if(this.multiDropSlctValues[element.detailId] === undefined){
            this.alertify.error("Please Select Options");
            this.emitCount++;
            return;
          }
        }
      });
    }
   }

    
    if (this._tierSelected) {
      if (this.detailsFormGroup.controls['detailTierOption'].touched) {
        if (!this._selectTier) {
          this.alertify.error("Please select Tier Options");
          this.emitCount++;
          return;
        }
      }
      else {
        if (this.detailsFormGroup.controls['detailTierOption'].value === "") {
          this.alertify.error("Please select Tier Value");
          this.emitCount++;
          return;
        }
      }
    }

    if (this.detailsFormGroup.controls['LineHeader'].value === "") {
      this.alertify.error("Please submit the Header");
      this.emitCount++;
      return;
    }

    if (this.emitCount == 0) {

      this._glbDisableAll = true;

      this.componentFinalArray = [];

      if (this.detailsFormGroup.value.detailsOptionValues.length > 0) {

        for (let i = 0; i < this.detailsFormGroup.value.detailsOptionValues.length; i++) {
          this.componentFinalArray.push({ 'insertType': '', 'inli_v_id': this.detailsFormGroup.value.detailsOptionValues[i].varblId, 'inli_data': this.detailsFormGroup.value.detailsOptionValues[i].controlid, 'inli_status': 'Y', 'inli_condition_id': '' });
        }
      }


      if(this.detailsFormGroup.value.detailsMultiOptionValues.length > 0){
        for(let i=0;i<this.detailsFormGroup.value.detailsMultiOptionValues.length;i++){
          if(this.multiDropSlctValues.length>0){
            if(this.multiDropSlctValues[this.detailsFormGroup.value.detailsMultiOptionValues[i].detailId] !== undefined){
              for(let j=0;j<this.multiDropSlctValues[this.detailsFormGroup.value.detailsMultiOptionValues[i].detailId].length;j++){
                this.componentFinalArray.push({ 'insertType': '', 'inli_v_id': this.detailsFormGroup.value.detailsMultiOptionValues[i].varblId, 'inli_data': this.multiDropSlctValues[this.detailsFormGroup.value.detailsMultiOptionValues[i].detailId][j].id, 'inli_status': 'Y', 'inli_condition_id': '' });
              }
            }
          }
        }
      }
    
      if (this.detailsFormGroup.value.detailsValues.length > 0) {

        for (let j = 0; j < this.detailsFormGroup.value.detailsValues.length; j++) {

          this.componentFinalArray.push({ 'insertType': '', 'inli_v_id': this.detailsFormGroup.value.detailsValues[j].varblId, 'inli_data': this.detailsFormGroup.value.detailsValues[j].idx, 'inli_status': 'Y', 'inli_condition_id': '' });

        }
      }

      if (this.detailsFormGroup.controls['detailTierOption'].value !== "") {
        this.componentFinalArray.push({ 'insertType': 'TIER', 'inli_v_id': this._glbTierVarId, 'inli_data': this.detailsFormGroup.controls['detailTierOption'].value, 'inli_status': 'Y', 'inli_condition_id': '' });
        if (this.tierBtn) {
          this.tierInfo.push({ 'insertType': 'TIERVARBL', 'inli_v_id': this._glbUnitVarId, 'inli_data': this.detailsFormGroup.controls['tierUnitPrice'].value, 'inli_status': 'Y', 'inli_condition_id': '' });
        }
        if (this.tierBtn1) {
          this.tierInfo.push({ 'insertType': 'TIERVARBL', 'inli_v_id': this._glbMsrpVarId, 'inli_data': this.detailsFormGroup.controls['tierMSRP'].value, 'inli_status': 'Y', 'inli_condition_id': '' });
        }
      }

      if (this.detailsFormGroup.controls['LineHeader'].value !== "") {
        this.lineHeader.push({ 'insertType': '', 'inl_id': this.lineItemsInfo["lineHdrId"], 'inl_mi_id': this.lineItemsInfo["incentiveId"], 'inl_name': this.detailsFormGroup.controls['LineHeader'].value })
      }
      // }
      //   else {
      //this.FinalArray.emit(this.componentFinalArray);
      //this.emitCount++;
      let action = "";
      if (this.lineItemsInfo["viewType"] === "U")
        action = "U";
      else
        action = "A";

      const obj = { "action": action, "lineHeaderInfo": this.lineHeader, "incentivelinedetails": this.componentFinalArray, "tierInfo": this.tierInfo };



      this.ApiService.postmethod('incentivelinedetails', obj).subscribe((res: any) => {
        if (res.status == 200) {
          this._glbIsSaved = true;
          this.lineHeader = [];
          this.tierInfo = [];
          this.alertify.success("Incentive Details Added Successfully");


        }
      })

    }

    this.emitCount = 0;

  }

  updateLineItems: any = []; _updtLineHdrId: number = 0;
  getLineItemById(lineItemId) {

    const obj = { "lineId": lineItemId }

    this.ApiService.postmethod('incentivemaster/getLineItemById', obj).subscribe((res: any) => {

      if (res.status === 200) {
        if (res.response !== null) {
          this.updateLineItems = res.response;

          this.updateLineItems.sort((l1, l2): number => {
            if (l1.Varbl_Priority < l2.Varbl_Priority) return -1;
            if (l1.Varbl_Priority > l2.Varbl_Priority) return 1;
            return 0;
          });
          let itemCounter: number = 0;
          itemCounter = 0;
          this.updateLineItems.forEach(
            (updtElement) => {

              this.multiDropSlctValues[updtElement.Varbl_Unique_Id] === undefined
              ? (this.multiDropSlctValues[updtElement.Varbl_Unique_Id] = [{ id: updtElement.Varbl_Data, itemName: "" }])
              : this.multiDropSlctValues[updtElement.Varbl_Unique_Id].push({
                id: updtElement.Varbl_Data,
                itemName: "",
              });
              
              if (updtElement.Varbl_Unique_Id === 1001)
                this._glbLineHdrName = updtElement.Varbl_LineHdr_Name;


              this.originalItems.forEach(
                (element) => {
                  if (updtElement.Varbl_Unique_Id === element.value.Varbl_Unique_Id) {

                    element.selected = true;
                    element.data = updtElement.Varbl_Data;

                    $('#' + updtElement.Varbl_Unique_Id).removeClass('cdk-drag-disabled');
                    $('#' + updtElement.Varbl_Unique_Id).addClass('disabled');

                   

                    if (updtElement.Varbl_Unique_Id === 1001) {
                     
                      this._yearSelected = true;

                    }
                    if (updtElement.Varbl_Unique_Id === 1002) {
                      this._modalIncSelected = true;
                     
                    }
                    if (updtElement.Varbl_Unique_Id === 1003) {
                      this._modalExcSelected = true;
                   
                    }
                    if (updtElement.Varbl_Unique_Id === 1004) {
                      this._styleIncSelected = true;
                     
                    }
                    if (updtElement.Varbl_Unique_Id === 1005) {
                      this._styleExcSelected = true;
                     
                    }
                    if (updtElement.Varbl_Unique_Id === 1008) {
                      this._tierSelected = true;
                      this._updtTierValue = updtElement.Varbl_Data;
                    }
                    if (updtElement.Varbl_Unique_Id === 1006) {
                      this._unitSelected = true;
                      if (this._tierSelected) {
                        this.tierBtn = true;
                      }

                    }
                    if (updtElement.Varbl_Unique_Id === 1007) {
                      this._msrpSelected = true;
                      if (this._tierSelected) {
                        this.tierBtn1 = true;
                      }
                    }
                  }
                  if (element.value.Varbl_Unique_Id === 1000) {
                    element.selected = true;
                    element.data = updtElement.Varbl_LineHdr_Name;
                  }

                })
              itemCounter++;

            });
          this._glbModelId = this._glbModel;
          this.updateItems();
        }
      }
    })
  }

  updateItems() {

    this._glbSelectEnabled = true;
    this._addItem = true;
    this._removeItem = false;
   
    this.moveItems(this.originalItems, this.selectedItems, 0);
    let sortMultiOption = this.detailsMultiOptionValues.value;
    sortMultiOption.sort((l1, l2): number => {
      if (l1.detailId < l2.detailId) return -1;
      if (l1.detailId > l2.detailId) return 1;
      return 0;
    });

    this.detailsMultiOptionValues.patchValue(sortMultiOption);
  }


  updateForm(FormCntrlId, data) {
    this.detailsFormGroup.patchValue(
      {

        FormCntrlId: data

      });
  }




  addLineItem() {
    this._glbIsSaved = false;
    this._glbDetailCnt++;
    this._glbDisableAll = false;
    this.resetSelection("");
    this.getLineItemCount(this.lineItemsInfo["incentiveId"]);

  }

  resetSelection(type) {

    this.originalItems = [];
    this.selectedItems = [];
    this.detailOptions = [];
    this.detailModelOptions = [];
    this.selectedDetailsItems = [];
    this.componentFinalArray = [];
    this.lineHeader = [];
    this.leftFilterText = "";
    this.rightFilterText = "";
    this.emitCount = 0;
    this._glbcnt = 0;
    this._glbSelectEnabled = false;
    this._glbEnableTier = false;
    this._selectTier = false;
    this._tierSelected = false;
    this._unitSelected = false;
    this._msrpSelected = false;
    this._glbTierVarId = 0;
    this._glbUnitVarId = 0;
    this._glbMsrpVarId = 0;
    this._glbStyleInc = 0;
    this._glbStyleExc = 0;
    this._glbYear = 2021;
    this._glbModel = 0;
    this.updateLineItems = [];
    this._updtLineHdrId = 0;
    this._updtTierValue = "";
    this._updtUnitPriceVal = "";
    this._updtMsrpVal = "";

    this.itemExists = false;
    this._stylExcSlctd = false;
    this._mdlIncSlctd = false;
    this._mdlExcSlctd = false;
    this._yearSlctd = false;
    this._regionSlctd = false;
    this.tierBtn = false;
    this.tierBtn1 = false;
    this._mdlIdForStyles = "";
    this._itemsUpdated = false;
    this._addItem = false;
    this._removeItem = false;
    this.mdlSlctdValues = [];
    this.stylSlctdValues = [];
    this.yearSlctdValues = [];
    this._enableRightDrag = false;
    this.variablesList.forEach(element => {
      this.originalItems.push(new ListItem(element));
    });
    this.multiDropSlctValues=[];

    this._modalIncSelected = false;
    this._modalExcSelected = false;
    this._styleIncSelected = false;
    this._styleExcSelected = false;
    this._yearSelected = false;


    this.detailsFormGroup = this.formBuilder.group({
      tierUnitPrice: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      tierMSRP: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      LineHeader: "",
      detailTierOption: ['', ''],
      detailsValues: new FormArray([]),
      detailsOptionValues: new FormArray([]),
      detailsMultiOptionValues: new FormArray([]),
      
    })



    if (type !== "U") {
      // this.lineItemsInfo["viewType"] = "";
      // this.lineItemsInfo["lineHdrId"] = 0;
      this._glbLineHdrName = "";
      if (this.selectedList != null && this.selectedList != []) {
        this.setSelectedValues(this.selectedList);
        this.onChange(this.value);
      }
     
    }
    else {
      this.getLineItemById(this.lineItemsInfo["lineHdrId"]);
    }


  }

  // redirectToView(){
  //   this.apiSrvc.reload('incentiveMaster');
  // }

  onCancel() {
    this.resetSelection("");
    this.xButtonClick.emit(true);
  }

  _tierSelected: boolean = false; _unitSelected: boolean = false; _msrpSelected: boolean = false; _modalIncSelected: boolean = false;
  _modalExcSelected: boolean = false; _styleIncSelected: boolean = false; _styleExcSelected: boolean = false;
  _yearSelected: boolean = false; _detailSelected: boolean = false;
  isDraggable(detailId, event) {
    let _itemSelected: boolean = false;


    if (detailId === 1001) {
      this._yearSelected = !this._yearSelected;
      this.disabled = false;
      _itemSelected = this._yearSelected;
    }
    else if (detailId === 1002) {

      if (!this._modalExcSelected) {
        this._modalIncSelected = !this._modalIncSelected;
        _itemSelected = this._modalIncSelected;
        this.disabled = false;
      }
      else {
        this.disabled = true;
        this.alertify.error("You can select either Model Include or Model Exclude");

      }

    }
    else if (detailId === 1003) {

      if (!this._modalIncSelected) {
        this._modalExcSelected = !this._modalExcSelected;
        _itemSelected = this._modalExcSelected;
        this.disabled = false;
      }
      else {
        this.disabled = true;
        this.alertify.error("You can select either Model Include or Model Exclude");

      }

    }
    else if (detailId === 1004) {

      if (!this._styleExcSelected) {
        this._styleIncSelected = !this._styleIncSelected;
        _itemSelected = this._styleIncSelected;
        this.disabled = false;
      }
      else {
        this.disabled = true;
        this.alertify.error("You can select either Style Include or Style Exclude");

      }

    }
    else if (detailId === 1005) {

      if (!this._styleIncSelected) {
        this._styleExcSelected = !this._styleExcSelected;
        _itemSelected = this._styleExcSelected;
        this.disabled = false;
      }
      else {
        this.disabled = true;
        this.alertify.error("You can select either Style Include or Style Exclude");

      }

    }
    else {
      this.disabled = false;
      this._detailSelected = !this._detailSelected;
      _itemSelected = this._detailSelected;
    }


    return (!this.disabled && !this._glbDisableAll && _itemSelected);

  }

  pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
  public date1: Date = new Date();
  public date2: Date = new Date();

  display = [];
  changeFirstInput(e) {
    this.date1 = new Date(e.target.value.replace(this.pattern, '$3-$2-$1'));
    this.display.push(this.date1);
  }

  changeSecondInput(e) {
    this.date2 = new Date(e.target.value.replace(this.pattern, '$3-$2-$1'));
    this.display.push(this.date2);
    console.log('displayArray', this.display);
  }

  openModal(id: string) {
    this._selectTier = false;
    this.modalSrvc.open(id);
  }

  closeModal(id: string) {
    this.modalSrvc.close(id);
  }

  applyToModal(id) {
    this._selectTier = true;
    if (this.tierBtn) {
      this._updtMsrpVal = "";
      $('#1006').addClass('disabled');
      $('#1007').removeClass('disabled');
    }
    if (this.tierBtn1) {
      this._updtUnitPriceVal = "";
      $('#1006').removeClass('disabled');
      $('#1007').addClass('disabled');
    }
    this.closeModal(id);
  }



  _glbLineItemId: number = 0;
  getLineItemCount(incentiveId) {
    this._glbLineItemId = 0;
    const obj = { "incentiveId": incentiveId }

    this.ApiService.postmethod('incentivemaster/getLineItemCount', obj).subscribe((res: any) => {

      if (res.status === 200) {
        if (res.response !== null) {
          if (res.response.length !== 0) {
            if (this.lineItemsInfo["viewType"] !== "U")
              this._glbLineItemId = res.response.length + 1;
            else
              this._glbLineItemId = this.lineItemsInfo["lineHdrSeqnId"];
          }
          else {
            this._glbLineItemId = 1;
          }
        }
        else {
          this._glbLineItemId = 1;
        }
      }
    })
  }

  // isSelected(modelId:string,index:number) {
  //   let mdlSelected:boolean=false;
  //   mdlSelected=false;
  //   this.mdlSlctdValues.filter((item)=>{
  //     if(item.modelId===modelId.toString())
  //     mdlSelected=true;
  //   })

  //   return mdlSelected;
  // }

  numberOnly(event, detailId): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (detailId === 1006 || detailId === 1007) {
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        this.alertify.error("Enter Numbers only!!")
        return false;
      }
    }
    return true;

  }

  _glbDraggedId: number = 0;
  onDragToLeft(detailId, slctType) {
    this._glbDraggedId = detailId;
   
    let isSelected: boolean = true;
    // if (slctType === 'M') {


    if (detailId === 1005) {
      this._styleExcSelected = false;
    }
    if (detailId === 1004) {
      this._styleIncSelected = false;
    }
    if (detailId === 1003) {
      this._modalExcSelected = false;
    }
    if (detailId === 1003) {
      this._modalIncSelected = false;
    }
    if (detailId === 1001) {
      this._yearSelected = false;
    }

    this.originalItems.filter((toItem) => {
      if (toItem.value.Varbl_Unique_Id === detailId) {
        toItem.selected = false;
      }
    })
    isSelected = !isSelected;

    this.removeItems(0);
    return isSelected;

    // }
    // else {
    //   if (slctType === 'D') {
    //     return false;
    //   }
    // }
  }

  onMultiItemSelect(item: any, uniqId: any) {

    console.log(item);
    console.log(this.multiDropSlctValues);
    
  }

  OnMultiItemDeSelect(item: any,uniqId: any) {

    console.log(item);
    console.log(this.multiDropSlctValues);
  }
  onMultiSelectAll(items: any, uniqId: any) {

    console.log(items);
    
  }
  onMultiDeSelectAll(items: any,uniqId: any) {

    console.log(items);
   
  }

onAngularMultiClose(uniqId: any,varblId: any){
  if (uniqId === 1001) {
    if (this._mdlIncSlctd)
      this.getIncentiveDropdownInfo(1002, varblId);
    if (this._mdlExcSlctd)
      this.getIncentiveDropdownInfo(1003, varblId);
    if (this._stylIncSlctd)
      this.getIncentiveDropdownInfo(1004, varblId);
    if (this._stylExcSlctd)
      this.getIncentiveDropdownInfo(1005, varblId);
  }
  else if (uniqId === 1002 || uniqId === 1003) {
    if (this._stylIncSlctd)
      this.getIncentiveDropdownInfo(1004, varblId);
    if (this._stylExcSlctd)
      this.getIncentiveDropdownInfo(1005, varblId);
  }
}


markFormGroupTouched(formGroup: FormGroup) {
  (<any>Object).values(formGroup.controls).forEach(control => {
    if (control.controls) { // control is a FormGroup
      this.markFormGroupTouched(control);
    } else { // control is a FormControl
      control.markAsTouched();
    }
  });
 }


}
