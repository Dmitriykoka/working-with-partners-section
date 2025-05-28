import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContactService } from '../../services/contact.service';
import { Partner } from '../../models/partner.model';
import * as moment from 'moment';

@Component({
  selector: 'app-contact-dialog',
  templateUrl: './contact-dialog.component.html',
  styleUrls: ['./contact-dialog.component.scss']
})
export class ContactDialogComponent implements OnInit {
  contactForm: FormGroup;
  isPlanned: boolean;
  partner: Partner | null;
  contactMethods: string[] = ['Телефон', 'Email', 'WhatsApp', 'Telegram', 'Личная встреча', 'Другое'];
  importanceLevels: {value: string; label: string}[] = [
    {value: 'low', label: 'Низкая'},
    {value: 'medium', label: 'Средняя'},
    {value: 'high', label: 'Высокая'}
  ];

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    public dialogRef: MatDialogRef<ContactDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.partner = data.partner || null;
    this.isPlanned = data.isPlanned;
  }

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      partnerId: [this.partner?.id || '', Validators.required],
      managerId: [this.data.managerId, Validators.required],
      contactDate: [new Date(), Validators.required],
      planned: [this.isPlanned],
      contactMethod: ['', Validators.required],
      notes: [''],
      importance: ['medium', Validators.required],
      ...(this.isPlanned && {
        plannedDate: ['', Validators.required]
      })
    });

    if (this.partner) {
      this.contactForm.patchValue({
        partnerId: this.partner.id,
        importance: this.partner.importance
      });
    }
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      const formValue = this.contactForm.value;
      const contactData = {
        ...formValue,
        contactDate: moment(formValue.contactDate).toISOString(),
        ...(formValue.plannedDate && {
          plannedDate: moment(formValue.plannedDate).toISOString()
        })
      };

      this.contactService.createContact(contactData).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}