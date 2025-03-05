import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularTreeDataComponent } from './angular-tree-data.component';
import {CheckboxComponent} from "../checkbox/checkbox.component";
import {FormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    AngularTreeDataComponent,
    CheckboxComponent,
  ],
  imports: [
    CommonModule,
    FormsModule
  ] , exports: [AngularTreeDataComponent]
})
export class AngularTreeDataModule { }
