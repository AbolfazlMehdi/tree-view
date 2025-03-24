import {Component, OnInit} from '@angular/core';
import {TreeNode} from "./model/tree-node.model";
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'angular-tree-view';
  items: TreeNode[] = [];

  form = new FormGroup({
    name: new FormControl({value: "1.2" , disabled: false}),
  });

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

  ngOnInit(): void {
    this.form.get('name')?.valueChanges.subscribe({
      next: (res) => {
        console.log('res', res);
      },
    });
  }

  onSelect(e: any) {
    console.log(e);
  }
  onChangeValue() {
    const val: any = '1.1';
    this.form.get('name')?.setValue(val, { emitEvent: false });
    
  }
}
