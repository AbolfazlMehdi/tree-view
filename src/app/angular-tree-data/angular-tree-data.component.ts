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
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from "@angular/forms";
import {TreeNode} from "../model/tree-node.model";
import {CommonModule} from "@angular/common";

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
    const selectedNode: TreeNode | undefined = this.selectedNode.find(
      (x) => x[this.bindValue] === node[this.bindValue]
    );
    if (selectedNode) {
      this.singleSelected = null;
      this.selectedNode = [];
      this.selectionChange.emit(null);
      this.onChange(null);
    } else {
      this.singleSelected = node[this.bindValue];
      this.selectedNode = [node];
      this.selectionChange.emit(node);
      this.onChange(node);
    }
  }

  public onRemoveSingleSelected(): void {
    this.singleSelected = null;
    this.selectedNode = [];
    this.onChange(null);
    this.selectionChange.emit(null);
  }

  public toggleSelection(node: TreeNode): void {
    node.selected = !node.selected;
    this.selectionChange.emit(node);
    if (this.selectionMode === 'separate') {
      this.fillSelectedSeparateNode(node);
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
      this.setSelectedNode(node);
    } else {
      this.selectedNode = this.selectedNode.filter(
        (x: TreeNode): boolean => x[this.bindValue] !== node[this.bindValue]
      );
    }
    this.selectionChange.emit(this.selectedNode);
    this.onChange(this.selectedNode);
  }

  setSelectedNode(node: TreeNode): void {
    this.selectedNode.push(node);
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
      console.log(node.parent);

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

  toggleExpand(node: TreeNode) {
    node.expanded = !node.expanded;
  }

  emitMultiSelection() {
    const selectedNodes = this.getSelectedNodes(this.nodes);
    this.selectedNode = selectedNodes;
    this.onChange(selectedNodes);
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
}

