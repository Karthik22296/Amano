import { NgModule } from "@angular/core";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { IConfig, NgxMaskModule } from "ngx-mask";
import { AutoCompleteDirective } from "../services/autocomplete";
import { ConfirmDialogComponent } from "./pages/confirm-dialog/confirm-dialog.component";
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule} from '@angular/material/snack-bar';
import { MatNativeDateModule } from "@angular/material/core";
import {MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { MatButtonModule } from "@angular/material/button";
import {MatRadioModule} from '@angular/material/radio';
import { FullCalendarModule } from "@fullcalendar/angular";
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction'; // a plugin!
import { MatCheckboxModule } from "@angular/material/checkbox";
import { FileInputConfig, MaterialFileInputModule, NGX_MAT_FILE_INPUT_CONFIG } from 'ngx-material-file-input';
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { UpdateStatusComponent } from './pages/schedule/update-status/update-status.component';

export const config: FileInputConfig = {
  sizeUnit: 'Octet',
};
export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;
const maskConfig: Partial<IConfig> = {
  validation: false,
};
FullCalendarModule.registerPlugins([
  dayGridPlugin,
   timeGridPlugin,
   listPlugin,
  interactionPlugin
]);
const maskConfigFunction: () => Partial<IConfig> = () => {
  return {
    validation: false,
  };
};
const modules = [
  MatAutocompleteModule,
  MatIconModule,
  MatInputModule,
  MatStepperModule,
  MatDatepickerModule,
  MatDialogModule,
  MatSnackBarModule,
  MatNativeDateModule,
  MatFormFieldModule,
  MatSelectModule,
  MatButtonModule,
  MatRadioModule,
  MatCheckboxModule,
  MaterialFileInputModule
];

@NgModule({

  imports: [modules, NgxMaskModule.forRoot(maskConfig),FullCalendarModule ],
  exports: [modules, AutoCompleteDirective, NgxMaskModule,FullCalendarModule],
  declarations: [AutoCompleteDirective, ConfirmDialogComponent, UpdateStatusComponent],
  providers: [{ provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { float: 'always' } },{ provide: NGX_MAT_FILE_INPUT_CONFIG, useValue: config }],


})
export class MaterialModule { }