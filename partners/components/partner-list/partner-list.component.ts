import { Component, OnInit } from '@angular/core';
import { PartnerService } from '../../services/partner.service';
import { ContactService } from '../../services/contact.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Partner } from '../../models/partner.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ContactDialogComponent } from '../contact-dialog/contact-dialog.component';

@Component({
  selector: 'app-partner-list',
  templateUrl: './partner-list.component.html',
  styleUrls: ['./partner-list.component.scss']
})
export class PartnerListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'category', 'lastContact', 'nextContact', 'importance', 'actions'];
  dataSource: MatTableDataSource<Partner>;
  currentUser: any;
  categories: string[] = [];
  selectedCategory: string = '';

  constructor(
    private partnerService: PartnerService,
    private contactService: ContactService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource<Partner>([]);
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadPartners();
    this.loadCategories();
  }

  loadPartners(): void {
    if (this.currentUser.role === 'teamLeader') {
      this.partnerService.getAllPartners().subscribe(partners => {
        this.dataSource.data = partners;
      });
    } else {
      this.partnerService.getPartnersByManager(this.currentUser.id).subscribe(partners => {
        this.dataSource.data = partners;
      });
    }
  }

  loadCategories(): void {
    this.partnerService.getCategories().subscribe(categories => {
      this.categories = categories.map(c => c.name);
    });
  }

  applyFilter(): void {
    if (this.selectedCategory) {
      this.dataSource.data = this.dataSource.data.filter(partner => partner.category === this.selectedCategory);
    } else {
      this.loadPartners();
    }
  }

  openContactDialog(partner: Partner, isPlanned: boolean = false): void {
    const dialogRef = this.dialog.open(ContactDialogComponent, {
      width: '600px',
      data: {
        partner,
        isPlanned,
        managerId: this.currentUser.id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPartners();
      }
    });
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }
}