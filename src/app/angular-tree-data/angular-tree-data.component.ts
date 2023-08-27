import {Component, forwardRef} from '@angular/core';
import {NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'angular-tree-data',
  templateUrl: './angular-tree-data.component.html',
  styleUrls: ['./angular-tree-data.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AngularTreeDataComponent),
    multi: true,
  },
  ]
})
export class AngularTreeDataComponent   {

}

