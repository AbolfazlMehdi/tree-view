import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-tree-view';
  items = [
    {
      title: 'test', id: '1', children: [
        {title: 'test1', id: '1.1'}
      ]
    },
    {
      title: 'test22', id: '2', children: [
        {title: 'علی', id: '2.1'},
        {
          title: 'ممد', id: '2.2', children: [
            {
              title: 'test2.2.2', id: '2.2.2',
              children: [
                {title: 'test2.1', id: '2.1'},
                {
                  title: 'test2.2', id: '2.2', children: [
                    {title: 'test2.2', id: '2.2.2'}
                  ]
                }
              ]
            },
            {
              title: 'test2.2.3', id: '2'
            }
          ]
        },

      ]
    },
    {
      title: 'test23', id: '2'
    }
  ]
}
