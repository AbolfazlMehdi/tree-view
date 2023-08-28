import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {debounceTime, distinctUntilChanged, Subject} from "rxjs";

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
export class AngularTreeDataComponent implements OnInit, ControlValueAccessor, OnDestroy, OnChanges {

  public setSelectData: any = [];
  txtQueryChanged: any = new Subject<string>();
  toggle: any = {};

  @Input() treeData: any[] = [];
  value = '';
  oldArray: any = [];
  @Input() searchPlaceholder: string = 'جستجو';
  @Output() selectItem = new EventEmitter<any[]>();
  @Input() bindChild = 'children';
  @Input() bindTitle = 'title';
  @Input() rtl: boolean = false;

  constructor() {
  }

  onChange: any = () => {
  };
  onTouched: any = () => {
  };


  ngOnInit(): void {
  }

  public writeValue(obj: any): void {
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.findParent(this.treeData);
  }

  ngOnDestroy(): void {
  }


  onToggle(index: any, indexChild: any) {
    if (indexChild !== null) {
      this.toggle[index + '.' + indexChild] = !this.toggle[index + '.' + indexChild];
    } else {
      this.toggle[index] = !this.toggle[index];
    }
  }

  selectNode(node: any, checked: boolean): void {
    this.check(node, checked);
    this.findParent(this.treeData);
  }


  check(node: any, checked: boolean, childSelected?: any) {
    if (childSelected) {
      node.childHasSelected = checked;
    }
    node.selected = checked;
    if (node[this.bindChild] && node[this.bindChild].length !== 0) {
      node[this.bindChild].forEach((x: any) => {
        const m = !!childSelected;
        this.check(x, checked, m);
      });
    }

  }

  findParent(data: any) {
    for (const i in data) {
      const itemsSelection: any = [];
      const itemsChildSelection: any = [];
      const item = data[i];
      if (item[this.bindChild] && item[this.bindChild].length !== 0) {
        this.findParent(item[this.bindChild]);
        item.selected = item[this.bindChild].every((itemChild: any) => {
          return itemChild.selected === true;
        });
        item[this.bindChild].forEach((itemChild: any) => {
          itemsSelection.push(itemChild.selected);
          itemsChildSelection.push(itemChild.childHasSelected);
        });

        this.hasChildSelected(item, itemsSelection, itemsChildSelection);

      }
      this.setArray(item);
    }
    setTimeout(() => {
      this.onChange(this.setSelectData);
      this.selectItem.emit(this.setSelectData);
    });
  }

  hasChildSelected(data: any, itemsSelection: any, itemsChildSelection: any) {
    const hasSelection = itemsSelection.indexOf(true);
    const hasChildSelection = itemsChildSelection.indexOf(true);
    data.childHasSelected = hasSelection !== -1;
    if (hasChildSelection !== -1) {
      data.childHasSelected = true;
    }
    if (data.selected) {
      data.childHasSelected = false;
    }
  }


  setArray(data: any) {
    const index = this.setSelectData.indexOf(data);
    if (index === -1) {
      if (data.selected) {
        this.setSelectData.push(data);
      }
    } else {
      if (!data.selected) {
        this.setSelectData.splice(index, 1);
      }
    }
  }
}

