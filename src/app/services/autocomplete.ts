import { Directive, Output, EventEmitter, Input, ElementRef, AfterViewInit } from '@angular/core';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[autoCompleteDirective]',
    host: {
        '(ngModelChange)': 'onInputChange()',
        '(focus)': 'loadAll()',
        '(keydown)': 'stateChangeEvent()',
        '(blur)': 'validate()',
        '(click)': 'showpanel()'
    }
})
export class AutoCompleteDirective implements AfterViewInit {
    @Input() dataList: any[] = []; //List of selectable item
    @Input('autoCompleteDirective') paramName: string; //Property name of Value in select options
    @Output() sendVal: EventEmitter<any> = new EventEmitter(); // Returned filterd list
    @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
    @Output() dataValue: EventEmitter<any> = new EventEmitter<any>();
    filterList: any[] = [];
    filterValue: any;
    @Input() isFromGrievance: boolean = false;
    constructor(private elm: ElementRef, private autoComp: MatAutocompleteTrigger,
        public model: NgControl) {
    }

    //Autocomplete Functionality using Tab, Up arrow and Down arrow keys without using mouse action
    ngAfterViewInit() {
        this.autoComp.panelClosingActions.subscribe(() => {
            if (this.autoComp.activeOption) {
                this.filterList = this.dataList;
                this.filterValue = this.autoComp.activeOption._getHostElement().innerText;
                if (this.filterValue) {
                    this.sendVal.emit(this.filterLookupName());
                } else {
                    this.sendVal.emit(this.dataList);
                }

            }
        });
    }
    onInputChange() {
        this.filterList = this.dataList;
        this.filterValue = this.elm.nativeElement.value;
        if (this.filterValue) {
            if (this.filterValue.length <= 1) {
                if (this.filterValue.charAt(0) === '' || this.filterValue.charAt(0) === ' ') {
                    this.elm.nativeElement.value = "";
                    this.model.valueAccessor.writeValue("");
                    this.model.control.setErrors({ 'invalid': true });
                }
            }
            this.sendVal.emit(this.filterLookupName());
        } else {
            this.sendVal.emit(this.dataList);
        }
    }
    showpanel() {
        this.autoComp.openPanel();
    }
    // To allow the string and number param 
    private filterLookupName() {
        let param = this.paramName ? this.paramName.split(',') : '';
        if (isNaN(this.filterValue) || this.filterValue[0] === "0") {
            this.filterValue = this.filterValue.toString().toUpperCase();
            if (param.length >= 2) {
                return this.paramName
                    ? this.dataList.filter(option => option[param[0]].toString().toUpperCase() === this.filterValue).length > 0
                        ? this.dataList.filter(option => option[param[0]].toString().toUpperCase() === this.filterValue)
                        : this.dataList.filter(option => option[param[1]].toString().toUpperCase().includes(this.filterValue))
                    : this.dataList.filter(option => option.toString().toUpperCase().includes(this.filterValue));
            }
            else {
                return this.paramName
                    ? this.dataList.filter(option => option[this.paramName].toString().toUpperCase().includes(this.filterValue))
                    : this.dataList.filter(option => option.toString().toUpperCase().includes(this.filterValue));
            }
        }
        else {
            this.filterValue = +this.filterValue;
            if (param.length >= 2) {
                return this.paramName
                    ? this.dataList.filter(option => option[param[0]] === this.filterValue).length > 0
                        ? this.dataList.filter(option => option[param[0]] === this.filterValue)
                        : this.dataList.filter(option => option[param[1]].toString().includes(this.filterValue))
                    : this.dataList.filter(option => option.toString().includes(this.filterValue));
            } else {
                return this.paramName
                    ? this.dataList.filter(option => option[this.paramName].toString().includes(this.filterValue))
                    : this.dataList.filter(option => option.toString().includes(this.filterValue));
            }
        }
    }

    loadAll() {
        this.sendVal.emit(this.dataList);
    }

    //Autocomplete Functionality using Tab, Up arrow and Down arrow keys 
    validate() {
        let param = this.paramName.split(',');
        //temporaryly adding the code for attachment entry component will tune the code ASAP
        if (this.isFromGrievance) {
            this.filterList = this.dataList;
            this.filterValue = this.elm.nativeElement.value;
        }
        if (this.filterList && this.filterValue) {
            let validateList;
            let data;
            this.filterValue = this.filterValue.toString();
            if (param.length >= 2) {
                validateList = this.filterList.filter(option => option[param[0]] === this.filterValue).length > 0
                    ? this.filterList.filter(option => option[param[0]] === this.filterValue).length
                    : this.filterList.filter(option => option[param[1]].trim().toLowerCase() === this.filterValue.trim().toLowerCase()).length;

                data = this.filterList.filter(re => re[param[0]] === this.filterValue).length > 0 ?
                    this.filterList.filter(re => re[param[0]] === this.filterValue)[0] :
                    this.filterList.filter(re => re[param[1]].trim().toLowerCase() === this.filterValue.trim().toLowerCase())[0];
            }
            else if (this.paramName) {
                validateList = this.filterList.filter(re => re[this.paramName].toString().trim().toLowerCase() === this.filterValue.trim().toLowerCase()).length;
                data = this.filterList.filter(re => re[this.paramName].toString().trim().toLowerCase() === this.filterValue.trim().toLowerCase())[0];
            }
            else {
                validateList = this.filterList.filter(re => re.trim().toLowerCase() === this.filterValue.trim().toLowerCase()).length;
                data = this.filterList.filter(re => re.trim().toLowerCase() === this.filterValue.trim().toLowerCase())[0];
            }
            //Validation for required field
            if (!validateList && this.filterValue) {
                this.elm.nativeElement.value = '';
                this.model.valueAccessor.writeValue('');
                if (this.elm.nativeElement.required) {
                    this.model.control.setErrors({ 'invalid': true });
                }
                else {
                    this.dataValue.emit(null);
                }
            } else {

                this.dataValue.emit(data);
            }
        }
    }
    stateChangeEvent() {
        this.autoComp.panelClosingActions
            .subscribe(e => {
                if (!(e && e.source)) {
                    this.autoComp.closePanel();
                    this.sendVal.emit(this.dataList);
                }
            });
    }
}
