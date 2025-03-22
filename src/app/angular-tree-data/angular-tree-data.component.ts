import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { TreeNode } from '../model/tree-node.model';
import { CommonModule } from '@angular/common';

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
  implements OnInit, ControlValueAccessor, OnDestroy, OnChanges
{
  @Input() multiSelection: boolean = true;
  @Input() showCheckBox: boolean = true;
  @Input() selectionMode: 'recursive' | 'separate' = 'recursive';

  @Output() selectionChange = new EventEmitter<TreeNode[] | TreeNode | null>();

  @Input() nodes: any[] = [];

  @Input() bindChild: string = 'children';
  @Input() bindTitle: string = 'name';
  @Input() bindValue: string = 'id';

  nodeItems: any[] = [];
  singleSelected: string | null = null;

  selectedNode: TreeNode[] = [];

  constructor() {}

  onChange: any = () => {};
  onTouched: any = () => {};

  ngOnInit(): void {}

  public writeValue(obj: any): void {}

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.nodeItems = [...this.nodes];
    this.assignParents(this.nodeItems, null);
  }

  ngOnDestroy(): void {}

  assignParents(nodes: TreeNode[], parent: TreeNode | null) {
    nodes.forEach((node: any) => {
      node.parent = parent;
      if (node.children) {
        this.assignParents(node.children, node);
      }
    });
  }

  /**
   call this method when multiSelect is false
   * */
  public toggleSingleSelection(node: TreeNode): void {
    const isSelectedNode: TreeNode | undefined = this.selectedNode.find(
      (x) => x[this.bindValue] === node[this.bindValue]
    );
    if (isSelectedNode) {
      this.onRemoveSingleSelected(node);
    } else {
      const newNode = this.removeExtraProperty(node);
      newNode.selected = true;
      this.fillSingleSelectedValue(node[this.bindValue], [node], newNode);
    }
  }

  public onRemoveSingleSelected(node: TreeNode): void {
    const newNode = this.removeExtraProperty(node);
    newNode.selected = false;
    this.fillSingleSelectedValue(null, [], newNode);
  }

  private fillSingleSelectedValue(
    singleSelected: string | null,
    node: TreeNode[] | [],
    emitedNode: TreeNode
  ): void {
    this.singleSelected = singleSelected;
    this.selectedNode = node;
    this.onChange(this.singleSelected);
    this.selectionChange.emit(emitedNode);
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
    node['childIsSelected'] = false;
    if (node.children) {
      node.children.forEach((child) => {
        child.selected = selected;
        this.updateChildren(child, selected);
      });
    }
  }

  updateParentsBaseOnFullChildrenSelected(node: TreeNode) {
    if (node.parent) {
      const allSiblingsSelected: boolean | undefined =
        node.parent.children?.every((child) => child.selected);
      node.parent.selected = allSiblingsSelected;
      if (allSiblingsSelected) {
        node.parent['childIsSelected'] = false;
      }
      this.updateParentsBaseOnFullChildrenSelected(node.parent);
    }
  }

  updateParentsBaseOnSomeChildrenSelected(node: TreeNode) {
    if (node.parent && !node.parent.selected) {
      node.parent['childIsSelected'] = node.parent.children?.some(
        (child) => child.selected || child['childIsSelected']
      );
      this.updateParentsBaseOnSomeChildrenSelected(node.parent);
    }
  }

  emitMultiSelection() {
    const selectedNodes = this.getSelectedNodes(this.nodes);
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
      if (node.children && !node.selected) {
        selected = selected.concat(this.getSelectedNodes(node.children));
      }
    });
    return selected;
  }

  private removeExtraProperty(node: TreeNode): any {
    const newNode: TreeNode = { ...node };
    delete newNode.parent;
    delete newNode['childIsSelected'];
    return newNode;
  }

  toggleExpand(node: TreeNode) {
    node.expanded = !node.expanded;
  }
}
