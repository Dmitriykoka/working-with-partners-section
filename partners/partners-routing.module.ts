import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartnerListComponent } from './components/partner-list/partner-list.component';
import { CalendarComponent } from './components/calendar/calendar.component';

const routes: Routes = [
  { path: 'list', component: PartnerListComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: '', redirectTo: 'list', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartnersRoutingModule { }