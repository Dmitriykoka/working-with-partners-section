import { Component, OnInit } from '@angular/core';
import { ContactService } from '../../services/contact.service';
import { PartnerService } from '../../services/partner.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import * as moment from 'moment';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  startDate: Date = moment().subtract(1, 'months').toDate();
  endDate: Date = new Date();
  selectedManager: string = 'all';
  managers: any[] = [];
  reports: any = {};
  isLoading = false;

  // Chart configurations
  contactsByCategoryChart: ChartConfiguration['data'] = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Контакты по категориям',
      backgroundColor: '#3f51b5'
    }]
  };

  plannedVsActualChart: ChartConfiguration['data'] = {
    labels: ['Запланировано', 'Выполнено', 'Пропущено'],
    datasets: [{
      data: [0, 0, 0],
      label: 'Контакты',
      backgroundColor: ['#3f51b5', '#4caf50', '#f44336']
    }]
  };

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false
  };

  chartType: ChartType = 'bar';

  constructor(
    private contactService: ContactService,
    private partnerService: PartnerService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadManagers();
    this.generateReports();
  }

  loadManagers(): void {
    // В реальном приложении здесь был бы запрос к API
    this.managers = [
      { id: 'all', name: 'Все менеджеры' },
      { id: '1', name: 'Иванов Иван' },
      { id: '2', name: 'Петрова Мария' }
    ];
  }

  generateReports(): void {
    this.isLoading = true;
    
    // Загрузка данных и формирование отчетов
    // В реальном приложении здесь были бы запросы к API
    setTimeout(() => {
      this.reports = {
        totalContacts: 42,
        completedContacts: 35,
        missedContacts: 7,
        rescheduledContacts: 3,
        averageResponseTime: '2.3 дня',
        contactsByCategory: [
          { category: 'VIP', count: 15 },
          { category: 'Стандарт', count: 20 },
          { category: 'Потенциальные', count: 7 }
        ]
      };

      this.updateCharts();
      this.isLoading = false;
    }, 1000);
  }

  updateCharts(): void {
    // Обновление данных для графиков
    this.contactsByCategoryChart = {
      labels: this.reports.contactsByCategory.map((item: any) => item.category),
      datasets: [{
        data: this.reports.contactsByCategory.map((item: any) => item.count),
        label: 'Контакты по категориям',
        backgroundColor: '#3f51b5'
      }]
    };

    this.plannedVsActualChart = {
      labels: ['Запланировано', 'Выполнено', 'Пропущено'],
      datasets: [{
        data: [
          this.reports.totalContacts,
          this.reports.completedContacts,
          this.reports.missedContacts
        ],
        label: 'Контакты',
        backgroundColor: ['#3f51b5', '#4caf50', '#f44336']
      }]
    };
  }

  onDateRangeChange(): void {
    this.generateReports();
  }

  onManagerChange(): void {
    this.generateReports();
  }
}