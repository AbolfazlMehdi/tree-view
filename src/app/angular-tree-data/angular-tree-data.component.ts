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
import {TreeNode} from "../model/tree-node.model";

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

  @Output() selectionChange = new EventEmitter<TreeNode[]>();

  @Input() nodes: any[] = []

  nodeItems: any[] = []

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
    this.nodeItems = [...this.nodes];
    this.assignParents(this.nodeItems, null);
  }

  ngOnDestroy(): void {
  }

  assignParents(nodes: TreeNode[], parent: TreeNode | null) {
    nodes.forEach((node: any) => {
      node.parent = parent;
      if (node.children) {
        this.assignParents(node.children, node);
      }
    });
  }

  toggleSelection(node: TreeNode) {
    node.selected = !node.selected;
    this.updateChildren(node, node.selected);
    this.updateParentsBaseOnFullChildrenSelected(node);
    this.updateParentsBaseOnSomeChildrenSelected(node);
    // this.emitSelection();
  }

  updateChildren(node: TreeNode, selected: boolean) {
    if (node.selected) {
      node['childIsSelected'] = false;
    }
    if (node.children) {
      node.children.forEach(child => {
        child.selected = selected;
        this.updateChildren(child, selected);
      });
    }
  }

  updateParentsBaseOnFullChildrenSelected(node: TreeNode) {
    if (node.parent) {
      const allSiblingsSelected: boolean | undefined = node.parent.children?.every(child => child.selected);
      node.parent.selected = allSiblingsSelected;
      if (allSiblingsSelected) {
        node.parent['childIsSelected'] = false;
      }
      this.updateParentsBaseOnFullChildrenSelected(node.parent);
    }
  }

  updateParentsBaseOnSomeChildrenSelected(node: TreeNode) {
    if (node.parent && !node.parent.selected) {
      node.parent['childIsSelected'] = node.parent.children?.some(child => child.selected || child['childIsSelected']);
      this.updateParentsBaseOnSomeChildrenSelected(node.parent);
    }
  }

  toggleExpand(node: TreeNode) {
    node.expanded = !node.expanded;
  }

  emitSelection() {
    const selectedNodes = this.getSelectedNodes(this.nodes);
    this.selectionChange.emit(selectedNodes);
  }

  getSelectedNodes(nodes: TreeNode[]): TreeNode[] {
    let selected: TreeNode[] = [];
    nodes.forEach(node => {
      if (node.selected) {
        selected.push(node);
      }
      if (node.children) {
        selected = selected.concat(this.getSelectedNodes(node.children));
      }
    });
    return selected;
  }

}

