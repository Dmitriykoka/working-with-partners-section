import { loadPartners, loadContacts, formatCurrency } from './data.js';

let partners = [];
let contacts = [];
let charts = [];

function destroyCharts() {
    charts.forEach(chart => {
        if (chart && typeof chart.destroy === 'function') {
            chart.destroy();
        }
    });
    charts = [];
}

function initReports() {
    try {
        partners = loadPartners();
        contacts = loadContacts();
        
        destroyCharts();
        updateStats();
        renderCharts();
        setupEventHandlers();
    } catch (error) {
        console.error('Error in initReports:', error);
    }
}

function setupEventHandlers() {
    const periodSelect = document.getElementById('report-period');
    if (periodSelect) {
        periodSelect.addEventListener('change', function() {
            destroyCharts();
            updateStats();
            renderCharts();
        });
    }
}

function updateStats() {
    const period = document.getElementById('report-period').value;
    
    // Фильтрация данных по периоду (заглушка)
    const filteredPartners = [...partners];
    
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
    try {
        // Распределение по категориям
        const categoriesCtx = document.getElementById('categories-chart');
        if (categoriesCtx) {
            const categoriesChart = new Chart(categoriesCtx, {
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
            });
            charts.push(categoriesChart);
        }

        // Прибыль по месяцам
        const profitCtx = document.getElementById('profit-chart');
        if (profitCtx) {
            const profitChart = new Chart(profitCtx, {
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
            });
            charts.push(profitChart);
        }

        // Контакты по менеджерам
        const managersCtx = document.getElementById('managers-chart');
        if (managersCtx) {
            const managersChart = new Chart(managersCtx, {
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
            });
            charts.push(managersChart);
        }

        // Статусы партнеров
        const statusesCtx = document.getElementById('statuses-chart');
        if (statusesCtx) {
            const statusesChart = new Chart(statusesCtx, {
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
            });
            charts.push(statusesChart);
        }
    } catch (error) {
        console.error('Error rendering charts:', error);
    }
}

export { initReports };