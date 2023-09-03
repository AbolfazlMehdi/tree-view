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
import {Subject} from "rxjs";

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
    this.toggle[index + '.' + indexChild] = !this.toggle[index + '.' + indexChild];
  }

  selectNode(node: Node, checked: boolean): void {
    this.check(node, checked);
    this.findParent(this.treeData);
  }


  check(node: Node, checked: boolean): void {
    node.selected = checked;
    node.children?.forEach(child => this.check(child, checked));
  }

  findParent(nodes: Node[]): void {
    this.searchForParent(nodes)
    this.onChange(this.setSelectData);
    this.selectItem.emit(this.setSelectData);
  }

  searchForParent(nodes: Node[]) {
    nodes.forEach(node => {
      if (node.children) {
        this.searchForParent(node.children);
        node.selected = node.children.every(child => child.selected);
        node.childIsSelected = node.children.some(child => child.selected);
        this.hasChildSelected(node)
      }
      this.setArray(node);
    });
  }

  hasChildSelected(node: Node): void {
    node.childIsSelected = node.children?.some(child => child.selected) || false;
    if (node.selected) {
      node.childIsSelected = false;
    }
  }


  setArray(node: Node): void {
    const index = this.setSelectData.indexOf(node);
    if (node.selected && index === -1) {
      this.setSelectData.push(node);
    } else if (!node.selected && index !== -1) {
      this.setSelectData.splice(index, 1);
    }
  }

}

interface Node {
  selected: boolean;
  childIsSelected?: boolean;
  children?: Node[];
}
