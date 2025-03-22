import {Component} from '@angular/core';
import {TreeNode} from "./model/tree-node.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'angular-tree-view';
  items: TreeNode[] = [];

  constructor() {
    this.items = [
      {
        id: '1',
        name: 'Fruits',
        selected: false,
        expanded: false,
        children: [
          {
            id: '1.1',
            name: 'Apple',
            selected: false,
            expanded: false,
            children: [
              { id: '1.1-1', name: 'Carrot', selected: false },
              {
                id: '1.1-2',
                name: 'Broccoli',
                selected: false,
                children: [
                  { id: '1.1-1-1', name: 'Carrot', selected: false },
                  { id: '1.1-2-2', name: 'Broccoli2', selected: false },
                ],
              },
            ],
          },
          { id: '1.2', name: 'Orange', selected: false },
        ],
      },
      {
        id: '2',
        name: 'Vegetables',
        selected: false,
        expanded: false,
        children: [
          { id: '2.1', name: 'Carrot3', selected: false },
          { id: '2.2', name: 'Broccoli3', selected: false },
        ],
      },
    ];
  }

  onSelect(e: any) {
    console.log(e)
  }
}
