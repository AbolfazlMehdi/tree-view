import {
  Component,
  EventEmitter, forwardRef,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor, NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  NgModel,
  ValidationErrors,
  Validator
} from "@angular/forms";

@Component({
  selector: '[app-checkbox]',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CheckboxComponent),
    multi: true,
  },
    {
      provide: NG_VALIDATORS,
      useExisting: CheckboxComponent,
      multi: true
    }
  ]
})
export class CheckboxComponent implements OnInit, ControlValueAccessor, Validator, OnChanges {


  @ViewChildren(NgModel) public validatedFields!: QueryList<NgModel>;

  public value: boolean = false;
  @Input() disabled: boolean = false;
  @Input() label: string = '';
  @Input() changeContentCheckbox: boolean = false;
  @Output() changeChecked = new EventEmitter<any>();
  @Input() initValue: boolean = false;
  @Input() customClass: string = '';
  @Input() tabIndex: any;
  @Input() hasForm: boolean = true;
  private newData: any;

  constructor() {
  }

  onChange: any = () => {
  };
  onTouched: any = () => {
  };

  onChangeChecked(event: any) {
    this.onChange(this.value);
    this.changeChecked.emit(event);
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initValue']) {
      this.value = this.initValue;
    }
  }

  public writeValue(obj: any) {
    this.newData = obj;
    this.value = this.newData;
  }


  public validate(control: AbstractControl): ValidationErrors | null {
    let validationErrors: ValidationErrors | null = null;
    if (this.validatedFields) {
      this.validatedFields.forEach((ngm: NgModel) => {
        if (ngm.errors !== null) {
          if (validationErrors === null) {
            validationErrors = {};
          }
          validationErrors = ngm.errors;
        }
      });
    }
    return validationErrors;
  }

  public registerOnChange(fn: any) {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any) {
    this.onTouched = fn;

  }
}
