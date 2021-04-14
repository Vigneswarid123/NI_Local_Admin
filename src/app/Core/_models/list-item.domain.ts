export class ListItem {
    constructor(value: any) {
        this.value = value;
        this.selected = false;
        this.data="";
    }
    public value: any;
    public selected: boolean = false;
    public data:string="";
}