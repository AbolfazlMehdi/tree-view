import {Component, EventEmitter, forwardRef, Input, OnChanges, OnDestroy, OnInit, Output,} from '@angular/core';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR,} from '@angular/forms';
import {TreeNode} from '../model/tree-node.model';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'angular-tree-data',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './angular-tree-data.component.html',
  styleUrls: ['./angular-tree-data.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AngularTreeDataComponent),
      multi: true,
    },
  ],
})
export class AngularTreeDataComponent
  implements OnInit, ControlValueAccessor, OnDestroy, OnChanges {
  private value: null | undefined | number | string | string[] | number[] =
    undefined;
  @Input() multiSelection: boolean = true;
  @Input() showCheckBox: boolean = true;
  @Input() selectionMode: 'recursive' | 'separate' = 'recursive';

  @Output() selectionChange = new EventEmitter<TreeNode[] | TreeNode | null>();

  @Input() items: any[] = [];

  @Input() bindChild: string = 'children';
  @Input() bindTitle: string = 'name';
  @Input() bindValue: string = 'id';

  nodeItems: any[] = [];
  singleSelected: string | null = null;

  selectedNode: TreeNode[] = [];
  onChange: any = () => {
  };
  onTouched: any = () => {
  };

  constructor() {
  }

  ngOnInit(): void {
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public writeValue(val: undefined |  null | number | string | string[] | number[] = null): void {
    this.value = val;
    this.setDefaultValue();
  }

  ngOnChanges() {
    this.nodeItems = [...this.items];
    this.assignParents(this.nodeItems, null);
    this.setDefaultValue();
  }

  /**
   * bind default value
   * call this method in OnChange or writeValue
   */
  private setDefaultValue(): void {
    if (!this.items.length ||  this.value === null  || this.value === undefined ) return;
    if (this.multiSelection ) {
      const values: string[] | number[] = Array.isArray(this.value) ? this.value : [];
      this.selectedNode = this.loopOfValuesOnSeperatedMode(this.items, values);
    } else {
      this.setDefaultValueOfSingleSelection(this.items);
    }

  }

  private loopOfValuesOnSeperatedMode(nodes: TreeNode[], values: any[]): TreeNode[] {
    let selected: TreeNode[] = [];
    nodes.forEach((node: TreeNode) => {
      delete node['someChildIsSelected'];
      const isSelected: boolean  = values.includes(node[this.bindValue]);
      if (isSelected ) {
        node.selected = isSelected;
        selected.push(node);
      } else if (this.selectionMode === 'recursive' &&
        (node.parent && !node.parent.selected) || !node.parent) {
        node.selected = false;
      } else if (this.selectionMode === 'separate' ) {
        node.selected = false;
      }
      if (this.selectionMode === 'recursive') {
        this.updateChildren(node, node.selected ?? false);
        this.updateParentsBaseOnFullChildrenSelected(node);
        this.updateParentsBaseOnSomeChildrenSelected(node);
      }
      if (node[this.bindChild]) {
        selected = selected.concat(
          this.loopOfValuesOnSeperatedMode(node[this.bindChild], values)
        );
      }
    });
    return selected;
  }

  private setDefaultValueOfSingleSelection(nodes: TreeNode[]): void {
    nodes.forEach((node: TreeNode) => {
      if (node[this.bindValue] === this.value) {
        this.fillDataInSingleSelectedMode(node, true)
        return;
      }
      if (node[this.bindChild] && node[this.bindChild].length) {
        this.setDefaultValueOfSingleSelection(node[this.bindChild]);
      }
    });
  }

  private assignParents(nodes: TreeNode[], parent: TreeNode | null): void {
    nodes.forEach((node: any) => {
      node.parent = parent;
      if (node[this.bindChild]) {
        this.assignParents(node[this.bindChild], node);
      }
    });
  }

  /**
   call this method when multiSelect is false
   * */
  public toggleSingleSelection(node: TreeNode, defaultSetValue: boolean = false): void {
    const isSelectedNode: TreeNode | undefined = this.selectedNode.find((x: TreeNode): boolean => x[this.bindValue] === node[this.bindValue]);
    if (isSelectedNode) {
      this.onRemoveSingleSelected(node);
    } else {
      this.fillDataInSingleSelectedMode(node, defaultSetValue)
    }
  }

  private fillDataInSingleSelectedMode(node: TreeNode, defaultSetValue: boolean = false): void {
    const newNode = this.removeExtraProperty(node);
    newNode.selected = true;
    this.fillSingleSelectedValue(node[this.bindValue], [node], newNode, defaultSetValue);
  }

  public onRemoveSingleSelected(node: TreeNode): void {
    const newNode = this.removeExtraProperty(node);
    newNode.selected = false;
    this.fillSingleSelectedValue(null, [], newNode);
  }

  private fillSingleSelectedValue(singleSelected: string | null, node: TreeNode[] | [], emitedNode: TreeNode, defaultSetValue: boolean = false): void {
    this.singleSelected = singleSelected;
    this.selectedNode = node;
    if (!defaultSetValue) {
      this.onChange(this.singleSelected);
      this.selectionChange.emit(emitedNode);
    }
  }

  public toggleMultiSelection(node: TreeNode): void {
    node.selected = !node.selected;
    const newNode = this.removeExtraProperty(node);
    this.selectionChange.emit(newNode);
    if (this.selectionMode === 'separate') {
      this.fillSelectedSeparateNode(node);
      return;
    }

    if (this.selectionMode === 'recursive') {
      this.updateChildren(node, node.selected);
      this.updateParentsBaseOnFullChildrenSelected(node);
      this.updateParentsBaseOnSomeChildrenSelected(node);
      this.emitMultiSelection();
    }
  }

  private fillSelectedSeparateNode(node: TreeNode): void {
    if (node.selected) {
      this.selectedNode.push(node);
    } else {
      this.selectedNode = this.selectedNode.filter(
        (x: TreeNode): boolean => x[this.bindValue] !== node[this.bindValue]
      );
    }
    const selectedValues = this.selectedNode.map((v) => v[this.bindValue]);
    this.onChange(selectedValues);
  }

  updateChildren(node: TreeNode, selected: boolean) {
    node['someChildIsSelected'] = false;
    if (node[this.bindChild]) {
      node[this.bindChild].forEach((child: TreeNode) => {
        child.selected = selected;
        this.updateChildren(child, selected);
      });
    }
  }

  updateParentsBaseOnFullChildrenSelected(node: TreeNode) {
    if (node.parent) {
      const allSiblingsSelected: boolean | undefined = node.parent[
        this.bindChild
        ]?.every((child: TreeNode) => child.selected);
      node.parent.selected = allSiblingsSelected;
      if (allSiblingsSelected) {
        node.parent['someChildIsSelected'] = false;
      }
      this.updateParentsBaseOnFullChildrenSelected(node.parent);
    }
  }

  updateParentsBaseOnSomeChildrenSelected(node: TreeNode) {
    if (node.parent && !node.parent.selected) {
      node.parent['someChildIsSelected'] = node.parent[this.bindChild]?.some(
        (child: TreeNode) => child.selected || child['someChildIsSelected']
      );
      this.updateParentsBaseOnSomeChildrenSelected(node.parent);
    }
  }

  emitMultiSelection() {
    const selectedNodes = this.getSelectedNodes(this.items);
    this.selectedNode = selectedNodes;
    const selectedValues = selectedNodes.map((v) => v[this.bindValue]);
    this.onChange(selectedValues);
  }

  getSelectedNodes(nodes: TreeNode[]): TreeNode[] {
    let selected: TreeNode[] = [];
    nodes.forEach((node) => {
      if (node.selected) {
        selected.push(node);
      }
      if (node[this.bindChild] && !node.selected) {
        selected = selected.concat(this.getSelectedNodes(node[this.bindChild]));
      }
    });
    return selected;
  }

  private removeExtraProperty(node: TreeNode): any {
    const newNode: TreeNode = {...node};
    delete newNode.parent;
    delete newNode['someChildIsSelected'];
    return newNode;
  }

  toggleExpand(node: TreeNode) {
    node.expanded = !node.expanded;
  }

  ngOnDestroy(): void {
  }
}
