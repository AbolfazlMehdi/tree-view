import {Component, forwardRef} from '@angular/core';
import {NG_VALIDATORS, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'app-checkbox',
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
export class CheckboxComponent {
}
