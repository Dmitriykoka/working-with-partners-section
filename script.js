document.addEventListener('DOMContentLoaded', function() {
    // Sample data
    const partners = [
        {
            id: 1,
            name: 'ООО "Технологии Будущего"',
            email: 'info@futuretech.ru',
            phone: '+7 (495) 123-45-67',
            manager: 'Иван Петров',
            status: 'call',
            priority: 'high',
            nextContact: '2023-05-20T14:00',
            type: 'planned'
        },
        {
            id: 2,
            name: 'АО "Инновационные решения"',
            email: 'contact@innov.ru',
            phone: '+7 (495) 987-65-43',
            manager: 'Мария Сидорова',
            status: 'planned',
            priority: 'medium',
            nextContact: '2023-05-22T10:30',
            type: 'planned'
        },
        {
            id: 3,
            name: 'ИП Смирнов А.В.',
            email: 'smirnov@mail.ru',
            phone: '+7 (916) 123-45-67',
            manager: 'Алексей Иванов',
            status: 'overdue',
            priority: 'low',
            nextContact: '2023-05-15T11:00',
            type: 'unplanned'
        },
        {
            id: 4,
            name: 'ООО "ТехноПром"',
            email: 'sales@technoprom.ru',
            phone: '+7 (495) 555-12-34',
            manager: 'Иван Петров',
            status: 'completed',
            priority: 'medium',
            nextContact: '2023-06-01T16:00',
            type: 'planned'
        }
    ];

    const contactsHistory = [
        {
            id: 1,
            partnerId: 1,
            date: '2023-05-10T14:00',
            type: 'planned',
            status: 'completed',
            priority: 'high',
            notes: 'Обсудили новые условия сотрудничества'
        },
        {
            id: 2,
            partnerId: 1,
            date: '2023-05-15T11:30',
            type: 'unplanned',
            status: 'completed',
            priority: 'high',
            notes: 'Срочный вопрос по поставке'
        },
        {
            id: 3,
            partnerId: 2,
            date: '2023-05-05T10:00',
            type: 'planned',
            status: 'completed',
            priority: 'medium',
            notes: 'Плановый звонок, все ок'
        },
        {
            id: 4,
            partnerId: 3,
            date: '2023-05-15T11:00',
            type: 'planned',
            status: 'overdue',
            priority: 'low',
            notes: 'Не удалось связаться'
        }
    ];

    const upcomingContacts = [
        {
            id: 1,
            partnerId: 1,
            partnerName: 'ООО "Технологии Будущего"',
            date: '2023-05-20T14:00',
            type: 'planned',
            priority: 'high',
            notes: 'Обсуждение нового проекта'
        },
        {
            id: 2,
            partnerId: 2,
            partnerName: 'АО "Инновационные решения"',
            date: '2023-05-22T10:30',
            type: 'planned',
            priority: 'medium',
            notes: 'Квартальный отчет'
        },
        {
            id: 3,
            partnerId: 3,
            partnerName: 'ИП Смирнов А.В.',
            date: '2023-05-15T11:00',
            type: 'planned',
            priority: 'low',
            notes: 'Плановый звонок',
            status: 'overdue'
        }
    ];

    // DOM elements
    const partnersList = document.getElementById('partners-list');
    const partnerDetailsView = document.getElementById('partner-details-view');
    const dashboardView = document.getElementById('dashboard-view');
    const backToListBtn = document.getElementById('back-to-list');
    const addContactBtn = document.getElementById('add-contact-btn');
    const addContactModal = document.getElementById('add-contact-modal');
    const closeModalBtns = document.querySelectorAll('.close-btn');
    const completeContactModal = document.getElementById('complete-contact-modal');
    const calendarView = document.getElementById('calendar-view');
    const analyticsView = document.getElementById('analytics-view');
    const settingsView = document.getElementById('settings-view');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const currentMonthEl = document.getElementById('current-month');
    const calendarEl = document.getElementById('calendar');
    const todayBtn = document.getElementById('today-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const viewOptions = document.querySelectorAll('.btn-view');

    // Current date
    let currentDate = new Date();
    let currentView = 'month';
    let statusChart = null;
    let priorityChart = null;

    // Initialize the app
    function init() {
        renderPartnersList();
        setupEventListeners();
        renderCalendar();
    }

    // Setup event listeners
    function setupEventListeners() {
        // Navigation
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                document.querySelectorAll('nav li').forEach(li => li.classList.remove('active'));
                this.parentElement.classList.add('active');
                
                const target = this.getAttribute('href').substring(1);
                showView(target);
            });
        });

        // Back to list button
        backToListBtn.addEventListener('click', function() {
            partnerDetailsView.style.display = 'none';
            dashboardView.style.display = 'block';
        });

        // Add contact button
        addContactBtn.addEventListener('click', function() {
            addContactModal.style.display = 'flex';
        });

        // Close modal buttons
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                this.closest('.modal').style.display = 'none';
            });
        });

        // Click outside modal to close
        window.addEventListener('click', function(e) {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });

        // Tab buttons
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                tabBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `${tabId}-tab`) {
                        content.classList.add('active');
                    }
                });
            });
        });

        // Calendar navigation
        todayBtn.addEventListener('click', goToToday);
        prevBtn.addEventListener('click', goToPrevious);
        nextBtn.addEventListener('click', goToNext);

        // View options
        viewOptions.forEach(option => {
            option.addEventListener('click', function() {
                viewOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                currentView = this.getAttribute('data-view');
                renderCalendar();
            });
        });

        // Filter partners
        document.getElementById('manager-filter').addEventListener('change', filterPartners);
        document.getElementById('status-filter').addEventListener('change', filterPartners);
        document.getElementById('priority-filter').addEventListener('change', filterPartners);
        document.getElementById('type-filter').addEventListener('change', filterPartners);
        document.getElementById('reset-filters').addEventListener('click', resetFilters);
    }

    // Show specific view
    function showView(view) {
        dashboardView.style.display = 'none';
        partnerDetailsView.style.display = 'none';
        calendarView.style.display = 'none';
        analyticsView.style.display = 'none';
        settingsView.style.display = 'none';
        
        document.getElementById('page-title').textContent = getViewTitle(view);
        
        switch(view) {
            case 'dashboard':
                dashboardView.style.display = 'block';
                break;
            case 'calendar':
                calendarView.style.display = 'block';
                break;
            case 'analytics':
                analyticsView.style.display = 'block';
                initCharts();
                break;
            case 'settings':
                settingsView.style.display = 'block';
                break;
            default:
                dashboardView.style.display = 'block';
        }
    }

    // Get view title
    function getViewTitle(view) {
        const titles = {
            'dashboard': 'Дашборд',
            'calendar': 'Календарь',
            'analytics': 'Аналитика',
            'settings': 'Настройки'
        };
        return titles[view] || 'Дашборд';
    }

    // Render partners list
    function renderPartnersList(filteredPartners) {
        const data = filteredPartners || partners;
        partnersList.innerHTML = '';
        
        data.forEach(partner => {
            const partnerItem = document.createElement('div');
            partnerItem.className = 'partner-item';
            partnerItem.innerHTML = `
                <span class="name partner-name" data-id="${partner.id}">${partner.name}</span>
                <span class="status"><span class="status-badge status-${partner.status}">${getStatusText(partner.status)}</span></span>
                <span class="priority"><span class="priority-badge priority-${partner.priority}">${getPriorityText(partner.priority)}</span></span>
                <span class="next-contact">${formatDate(partner.nextContact)}</span>
                <span class="manager">${partner.manager}</span>
                <span class="actions">
                    <button class="action-btn complete-btn" data-id="${partner.id}" title="Отметить выполненным"><i class="fas fa-check"></i></button>
                    <button class="action-btn reschedule-btn" data-id="${partner.id}" title="Перенести"><i class="fas fa-calendar-times"></i></button>
                    <button class="action-btn edit-btn" data-id="${partner.id}" title="Редактировать"><i class="fas fa-edit"></i></button>
                </span>
            `;
            partnersList.appendChild(partnerItem);
        });

        // Add event listeners to partner names
        document.querySelectorAll('.partner-name').forEach(name => {
            name.addEventListener('click', function() {
                const partnerId = parseInt(this.getAttribute('data-id'));
                showPartnerDetails(partnerId);
            });
        });

        // Add event listeners to action buttons
        document.querySelectorAll('.complete-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                completeContactModal.style.display = 'flex';
            });
        });

        document.querySelectorAll('.reschedule-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                addContactModal.style.display = 'flex';
            });
        });
    }

    // Show partner details
    function showPartnerDetails(partnerId) {
        const partner = partners.find(p => p.id === partnerId);
        if (!partner) return;

        // Set partner info
        document.getElementById('partner-name').textContent = partner.name;
        document.querySelector('.partner-meta').innerHTML = `
            <span><i class="fas fa-envelope"></i> ${partner.email}</span>
            <span><i class="fas fa-phone"></i> ${partner.phone}</span>
            <span><i class="fas fa-user"></i> Менеджер: ${partner.manager}</span>
        `;

        // Render history
        const historyTab = document.getElementById('history-tab');
        const partnerHistory = contactsHistory.filter(c => c.partnerId === partnerId);
        
        if (partnerHistory.length > 0) {
            historyTab.innerHTML = '';
            partnerHistory.forEach(contact => {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                historyItem.innerHTML = `
                    <div>
                        <div class="history-date">${formatDate(contact.date)}</div>
                        <div class="history-type">${contact.type === 'planned' ? 'Плановый' : 'Внеплановый'}</div>
                    </div>
                    <div>
                        <span class="history-status status-${contact.status}">${getStatusText(contact.status)}</span>
                        <span class="priority-badge priority-${contact.priority}">${getPriorityText(contact.priority)}</span>
                    </div>
                    <div class="history-notes">${contact.notes}</div>
                `;
                historyTab.appendChild(historyItem);
            });
        } else {
            historyTab.innerHTML = '<p>Нет данных о контактах</p>';
        }

        // Render upcoming contacts
        const upcomingTab = document.getElementById('upcoming-tab');
        const partnerUpcoming = upcomingContacts.filter(c => c.partnerId === partnerId);
        
        if (partnerUpcoming.length > 0) {
            upcomingTab.innerHTML = '';
            partnerUpcoming.forEach(contact => {
                const upcomingItem = document.createElement('div');
                upcomingItem.className = 'upcoming-item';
                upcomingItem.innerHTML = `
                    <div>
                        <div class="upcoming-date">${formatDate(contact.date)}</div>
                        <div class="upcoming-type">${contact.type === 'planned' ? 'Плановый' : 'Внеплановый'}</div>
                    </div>
                    <div>
                        <span class="priority-badge priority-${contact.priority}">${getPriorityText(contact.priority)}</span>
                        ${contact.status === 'overdue' ? '<span class="history-status status-overdue">Просрочено</span>' : ''}
                    </div>
                    <div class="upcoming-notes">${contact.notes}</div>
                `;
                upcomingTab.appendChild(upcomingItem);
            });
        } else {
            upcomingTab.innerHTML = '<p>Нет запланированных контактов</p>';
        }

        // Show partner details view
        dashboardView.style.display = 'none';
        partnerDetailsView.style.display = 'block';
    }

    // Filter partners
    function filterPartners() {
        const managerFilter = document.getElementById('manager-filter').value;
        const statusFilter = document.getElementById('status-filter').value;
        const priorityFilter = document.getElementById('priority-filter').value;
        const typeFilter = document.getElementById('type-filter').value;

        const filtered = partners.filter(partner => {
            return (managerFilter === 'all' || partner.manager === 'Иван Петров' && managerFilter === '1' || 
                    partner.manager === 'Мария Сидорова' && managerFilter === '2' || 
                    partner.manager === 'Алексей Иванов' && managerFilter === '3') &&
                   (statusFilter === 'all' || partner.status === statusFilter) &&
                   (priorityFilter === 'all' || partner.priority === priorityFilter) &&
                   (typeFilter === 'all' || partner.type === typeFilter);
        });

        renderPartnersList(filtered);
    }

    // Reset filters
    function resetFilters() {
        document.getElementById('manager-filter').value = 'all';
        document.getElementById('status-filter').value = 'all';
        document.getElementById('priority-filter').value = 'all';
        document.getElementById('type-filter').value = 'all';
        renderPartnersList();
    }

    // Calendar functions
    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        currentMonthEl.textContent = `${getMonthName(month)} ${year}`;
        
        if (currentView === 'month') {
            renderMonthCalendar(year, month);
        } else if (currentView === 'week') {
            renderWeekCalendar(year, month, currentDate.getDate());
        } else {
            renderDayCalendar(year, month, currentDate.getDate());
        }
    }

    function renderMonthCalendar(year, month) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Adjust for Monday start
        
        calendarEl.innerHTML = '';
        
        // Weekdays header
        const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        const weekdaysRow = document.createElement('div');
        weekdaysRow.className = 'calendar-weekdays';
        
        weekdays.forEach(day => {
            const dayEl = document.createElement('div');
            dayEl.textContent = day;
            weekdaysRow.appendChild(dayEl);
        });
        
        calendarEl.appendChild(weekdaysRow);
        
        // Days grid
        const daysGrid = document.createElement('div');
        daysGrid.className = 'calendar-days';
        
        // Empty cells for days before the 1st of the month
        for (let i = 0; i < startingDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-day empty';
            daysGrid.appendChild(emptyCell);
        }
        
        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day';
            
            const currentDateObj = new Date();
            if (day === currentDateObj.getDate() && month === currentDateObj.getMonth() && year === currentDateObj.getFullYear()) {
                dayCell.classList.add('today');
            }
            
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            dayCell.appendChild(dayHeader);
            
            // Add events for this day
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEvents = getEventsForDate(dateStr);
            
            dayEvents.forEach(event => {
                const eventEl = document.createElement('div');
                eventEl.className = `calendar-event event-${event.priority}`;
                if (event.status === 'completed') {
                    eventEl.classList.add('event-completed');
                }
                eventEl.textContent = `${event.partnerName} - ${event.type === 'planned' ? 'Плановый' : 'Внеплановый'}`;
                dayCell.appendChild(eventEl);
            });
            
            daysGrid.appendChild(dayCell);
        }
        
        calendarEl.appendChild(daysGrid);
    }

    function renderWeekCalendar(year, month, day) {
        calendarEl.innerHTML = '<div class="week-view-container"><p>Недельный просмотр</p></div>';
    }

    function renderDayCalendar(year, month, day) {
        calendarEl.innerHTML = '<div class="day-view-container"><p>Дневной просмотр</p></div>';
    }

    function getEventsForDate(dateStr) {
        return upcomingContacts.filter(contact => {
            const contactDate = new Date(contact.date);
            const checkDate = new Date(dateStr);
            return contactDate.getFullYear() === checkDate.getFullYear() &&
                   contactDate.getMonth() === checkDate.getMonth() &&
                   contactDate.getDate() === checkDate.getDate();
        });
    }

    function goToToday() {
        currentDate = new Date();
        renderCalendar();
    }

    function goToPrevious() {
        if (currentView === 'month') {
            currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        } else if (currentView === 'week') {
            currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7);
        } else {
            currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1);
        }
        renderCalendar();
    }

    function goToNext() {
        if (currentView === 'month') {
            currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        } else if (currentView === 'week') {
            currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7);
        } else {
            currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
        }
        renderCalendar();
    }

    // Initialize charts
    function initCharts() {
        // Destroy existing charts if they exist
        if (statusChart) {
            statusChart.destroy();
        }
        if (priorityChart) {
            priorityChart.destroy();
        }

        // Status chart
        const statusCtx = document.getElementById('status-chart').getContext('2d');
        statusChart = new Chart(statusCtx, {
            type: 'doughnut',
            data: {
                labels: ['Выполнено', 'Просрочено', 'Запланировано'],
                datasets: [{
                    data: [12, 3, 8],
                    backgroundColor: [
                        '#28a745',
                        '#dc3545',
                        '#007bff'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });

        // Priority chart
        const priorityCtx = document.getElementById('priority-chart').getContext('2d');
        priorityChart = new Chart(priorityCtx, {
            type: 'bar',
            data: {
                labels: ['Высокая', 'Средняя', 'Низкая'],
                datasets: [{
                    label: 'Количество контактов',
                    data: [5, 10, 7],
                    backgroundColor: [
                        '#dc3545',
                        '#ffc107',
                        '#28a745'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    // Helper functions
    function getStatusText(status) {
        const statuses = {
            'call': 'Нужно позвонить',
            'planned': 'Запланировано',
            'overdue': 'Просрочено',
            'completed': 'Завершено'
        };
        return statuses[status] || status;
    }

    function getPriorityText(priority) {
        const priorities = {
            'high': 'Высокая',
            'medium': 'Средняя',
            'low': 'Низкая'
        };
        return priorities[priority] || priority;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function getMonthName(month) {
        const months = [
            'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
        ];
        return months[month];
    }

    // Initialize the app
    init();
});
