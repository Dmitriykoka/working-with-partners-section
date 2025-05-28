import { Component, OnInit } from '@angular/core';
import { ContactService } from '../../services/contact.service';
import { AuthService } from '../../../auth/services/auth.service';
import { CalendarOptions, EventClickArg } from '@fullcalendar/angular';
import { MatDialog } from '@angular/material/dialog';
import { ContactDialogComponent } from '../contact-dialog/contact-dialog.component';
import { Contact } from '../../models/partner.model';
import * as moment from 'moment';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: [],
    eventClick: this.handleEventClick.bind(this),
    eventColor: '#3f51b5',
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      meridiem: false
    },
    editable: true,
    eventDrop: this.handleEventDrop.bind(this),
    eventResize: this.handleEventResize.bind(this)
  };

  constructor(
    private contactService: ContactService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {
    const currentUser = this.authService.getCurrentUser();
    const startDate = moment().subtract(1, 'months').toDate();
    const endDate = moment().add(3, 'months').toDate();

    this.contactService.getPlannedContacts(startDate, endDate).subscribe(contacts => {
      this.calendarOptions.events = contacts.map(contact => ({
        id: contact.id,
        title: `Контакт с ${contact.partnerId}`,
        start: moment(contact.contactDate).toDate(),
        end: moment(contact.contactDate).add(30, 'minutes').toDate(),
        extendedProps: {
          contact,
          isPlanned: contact.planned
        },
        color: contact.planned ? '#3f51b5' : '#ff9800',
        textColor: '#ffffff'
      }));
    });
  }

  handleEventClick(clickInfo: EventClickArg): void {
    const contact = clickInfo.event.extendedProps.contact;
    const dialogRef = this.dialog.open(ContactDialogComponent, {
      width: '600px',
      data: {
        contact,
        isEdit: true
      }
    });

    dialogRef.afterClosed().subscribe(updated => {
      if (updated) {
        this.loadContacts();
      }
    });
  }

  handleEventDrop(dropInfo: any): void {
    const contactId = dropInfo.event.id;
    const newDate = dropInfo.event.start;
    
    this.contactService.rescheduleContact(
      contactId,
      newDate,
      'Перенесено через календарь'
    ).subscribe(() => {
      this.loadContacts();
    });
  }

  handleEventResize(resizeInfo: any): void {
    // Аналогично handleEventDrop
  }

  addNewContact(): void {
    const dialogRef = this.dialog.open(ContactDialogComponent, {
      width: '600px',
      data: {
        isPlanned: true,
        managerId: this.authService.getCurrentUser().id
      }
    });

    dialogRef.afterClosed().subscribe(added => {
      if (added) {
        this.loadContacts();
      }
    });
  }
}