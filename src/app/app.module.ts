import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {AngularTreeDataComponent} from "./angular-tree-data/angular-tree-data.component";
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AngularTreeDataComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
