// Analytics and Reporting Script
function initAnalytics() {
    // In a real app, this would fetch data from the server
    const analyticsData = {
        contactsByStatus: {
            completed: 45,
            planned: 30,
            overdue: 15,
            rescheduled: 10
        },
        contactsByPriority: {
            high: 25,
            medium: 50,
            low: 25
        },
        contactsTimeline: {
            labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'],
            completed: [12, 19, 15, 8, 10, 14],
            planned: [8, 12, 10, 15, 18, 12],
            overdue: [3, 5, 2, 7, 4, 6]
        },
        managerStats: [
            {
                name: 'Иванов И.',
                totalContacts: 60,
                completed: 45,
                overdue: 10,
                reactionTime: '2.5 ч'
            },
            {
                name: 'Петров А.',
                totalContacts: 40,
                completed: 30,
                overdue: 5,
                reactionTime: '1.8 ч'
            }
        ]
    };
    
    // Render charts
    renderContactsByStatusChart(analyticsData.contactsByStatus);
    renderContactsByPriorityChart(analyticsData.contactsByPriority);
    renderContactsTimelineChart(analyticsData.contactsTimeline);
    
    // Render manager stats table
    renderManagerStatsTable(analyticsData.managerStats);
}

function renderContactsByStatusChart(data) {
    const ctx = document.getElementById('contacts-by-status-chart').getContext('2d');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Завершено', 'Запланировано', 'Просрочено', 'Перенесено'],
            datasets: [{
                data: [data.completed, data.planned, data.overdue, data.rescheduled],
                backgroundColor: [
                    '#2ecc71', // green
                    '#3498db', // blue
                    '#e74c3c', // red
                    '#f39c12'  // orange
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Контакты по статусам'
                }
            }
        }
    });
}

function renderContactsByPriorityChart(data) {
    const ctx = document.getElementById('contacts-by-priority-chart').getContext('2d');
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Высокая', 'Средняя', 'Низкая'],
            datasets: [{
                data: [data.high, data.medium, data.low],
                backgroundColor: [
                    '#e74c3c', // red
                    '#f39c12', // orange
                    '#2ecc71'  // green
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Контакты по важности'
                }
            }
        }
    });
}

function renderContactsTimelineChart(data) {
    const ctx = document.getElementById('contacts-timeline-chart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: 'Завершено',
                    data: data.completed,
                    backgroundColor: '#2ecc71'
                },
                {
                    label: 'Запланировано',
                    data: data.planned,
                    backgroundColor: '#3498db'
                },
                {
                    label: 'Просрочено',
                    data: data.overdue,
                    backgroundColor: '#e74c3c'
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    stacked: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Динамика контактов по месяцам'
                }
            }
        }
    });
}

function renderManagerStatsTable(data) {
    const tableBody = document.querySelector('#manager-stats-table tbody');
    tableBody.innerHTML = '';
    
    data.forEach(manager => {
        const completionRate = Math.round((manager.completed / manager.totalContacts) * 100);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${manager.name}</td>
            <td>${manager.totalContacts}</td>
            <td>${manager.completed}</td>
            <td>${manager.overdue}</td>
            <td>${completionRate}%</td>
            <td>${manager.reactionTime}</td>
        `;
        tableBody.appendChild(row);
    });
}