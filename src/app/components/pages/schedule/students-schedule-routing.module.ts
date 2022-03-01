import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddScheduleComponent } from './add-schedule/add-schedule.component';

const routes: Routes = [
  {
    path: 'schedule-list',
    component: AddScheduleComponent
  },
  // {
  //   path: 'edit-package/:id',
  //   component: EditScheduleComponent
  // },
  // {
  //   path: 'about-student',
  //   component: AboutStudentComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentScheduleRoutingModule {}
