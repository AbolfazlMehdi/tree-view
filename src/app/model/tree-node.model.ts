export interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
  selected?: boolean;
  expanded?: boolean;
  parent?: TreeNode;
  [key: string]: any
}
