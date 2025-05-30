import { loadPartners, loadContacts, formatCurrency } from './data.js';

let partners = [];
let contacts = [];
let charts = []; // Массив для хранения экземпляров графиков

function initReports() {
    partners = loadPartners();
    contacts = loadContacts();
    
    // Уничтожаем предыдущие графики
    destroyCharts();
    
    updateStats();
    renderCharts();
    setupEventHandlers();
}

function destroyCharts() {
    charts.forEach(chart => chart.destroy());
    charts = [];
}

function setupEventHandlers() {
    document.getElementById('report-period').addEventListener('change', function() {
        updateStats();
        renderCharts();
    });
}

function updateStats() {
    const period = document.getElementById('report-period').value;
    
    // Фильтрация данных по периоду
    let filteredPartners = [...partners];
    let filteredContacts = [...contacts];
    
    // В реальном приложении здесь была бы фильтрация по датам
    
    document.getElementById('total-partners').textContent = filteredPartners.length;
    document.getElementById('active-partners').textContent = 
        filteredPartners.filter(p => p.status === 'active').length;
    
    const totalProfit = filteredPartners.reduce((sum, p) => sum + p.profit12m, 0);
    document.getElementById('total-profit').textContent = formatCurrency(totalProfit);
    
    const avgProfit = filteredPartners.length > 0 
        ? Math.round(totalProfit / filteredPartners.length) 
        : 0;
    document.getElementById('avg-profit').textContent = formatCurrency(avgProfit);
}

function renderCharts() {
    // Уничтожаем предыдущие графики
    destroyCharts();
    
    // Распределение по категориям
    const categoriesChart = new Chart(
        document.getElementById('categories-chart'), 
        {
            type: 'pie',
            data: {
                labels: ['A', 'B', 'C', 'D', 'Лид', 'Пауза'],
                datasets: [{
                    data: [
                        partners.filter(p => p.category === 'A').length,
                        partners.filter(p => p.category === 'B').length,
                        partners.filter(p => p.category === 'C').length,
                        partners.filter(p => p.category === 'D').length,
                        partners.filter(p => p.category === 'lead').length,
                        partners.filter(p => p.category === 'pause').length
                    ],
                    backgroundColor: [
                        '#f44336', '#2196f3', '#9e9e9e', 
                        '#ff9800', '#4caf50', '#795548'
                    ]
                }]
            }
        }
    );
    charts.push(categoriesChart);
    
    // Прибыль по месяцам
    const profitChart = new Chart(
        document.getElementById('profit-chart'), 
        {
            type: 'bar',
            data: {
                labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
                datasets: [{
                    label: 'Прибыль',
                    data: Array(12).fill().map(() => Math.floor(Math.random() * 5000000) + 1000000),
                    backgroundColor: '#4a6fa5'
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        }
    );
    
    // Контакты по менеджерам
    const managersChart = new Chart(
        document.getElementById('managers-chart'), 
        {
            type: 'doughnut',
            data: {
                labels: ['Иванов А.И.', 'Петров С.К.'],
                datasets: [{
                    data: [
                        contacts.filter(c => c.manager === 'Иванов А.И.').length,
                        contacts.filter(c => c.manager === 'Петров С.К.').length
                    ],
                    backgroundColor: ['#4CAF50', '#FFC107']
                }]
            }
        }
    );
    
    // Статусы партнеров
    const statusesChart = new Chart(
        document.getElementById('statuses-chart'), 
        {
            type: 'polarArea',
            data: {
                labels: ['Активен', 'На паузе', 'Архив'],
                datasets: [{
                    data: [
                        partners.filter(p => p.status === 'active').length,
                        partners.filter(p => p.status === 'paused').length,
                        partners.filter(p => p.status === 'archived').length
                    ],
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(255, 99, 132, 0.7)'
                    ]
                }]
            }
        }
    );
}

export { initReports };