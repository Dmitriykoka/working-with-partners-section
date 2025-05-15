// Calendar Management Script
function initCalendar() {
    const currentDate = new Date();
    let currentView = 'month';
    
    // Set initial view
    updateCalendar(currentDate, currentView);
    
    // View buttons
    document.querySelectorAll('.view-btn').forEach(button => {
        button.addEventListener('click', function() {
            currentView = this.getAttribute('data-view');
            document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            updateCalendar(currentDate, currentView);
        });
    });
    
    // Navigation buttons
    document.getElementById('prev-period').addEventListener('click', function() {
        navigatePeriod(-1, currentView, currentDate);
    });
    
    document.getElementById('next-period').addEventListener('click', function() {
        navigatePeriod(1, currentView, currentDate);
    });
}

function navigatePeriod(direction, view, currentDate) {
    if (view === 'day') {
        currentDate.setDate(currentDate.getDate() + direction);
    } else if (view === 'week') {
        currentDate.setDate(currentDate.getDate() + (7 * direction));
    } else if (view === 'month') {
        currentDate.setMonth(currentDate.getMonth() + direction);
    }
    updateCalendar(currentDate, view);
}

function updateCalendar(date, view) {
    // Update period title
    const periodTitle = document.getElementById('current-period');
    if (view === 'day') {
        periodTitle.textContent = date.toLocaleDateString('ru-RU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    } else if (view === 'week') {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        periodTitle.textContent = `${weekStart.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })} - ${weekEnd.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}`;
    } else if (view === 'month') {
        periodTitle.textContent = date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
    }
    
    // In a real app, this would fetch events from the server
    const events = [
        {
            id: 1,
            partner: 'ООО "Технологии Будущего"',
            date: new Date(new Date().setDate(new Date().getDate() + 1)),
            type: 'planned',
            status: 'planned',
            priority: 'high'
        },
        {
            id: 2,
            partner: 'АО "Инновационные Решения"',
            date: new Date(new Date().setDate(new Date().getDate() + 2)),
            type: 'planned',
            status: 'planned',
            priority: 'medium'
        },
        {
            id: 3,
            partner: 'ИП Сергеев К.Д.',
            date: new Date(new Date().setDate(new Date().getDate() - 1)),
            type: 'unplanned',
            status: 'overdue',
            priority: 'high'
        },
        {
            id: 4,
            partner: 'ЗАО "ТехноПрогресс"',
            date: new Date(new Date().setDate(new Date().getDate() - 3)),
            type: 'planned',
            status: 'completed',
            priority: 'low'
        }
    ];
    
    // Render calendar based on view
    const calendarView = document.getElementById('calendar-view');
    calendarView.innerHTML = '';
    
    if (view === 'day') {
        renderDayView(calendarView, date, events);
    } else if (view === 'week') {
        renderWeekView(calendarView, date, events);
    } else if (view === 'month') {
        renderMonthView(calendarView, date, events);
    }
}

function renderDayView(container, date, events) {
    const dayEvents = events.filter(event => 
        event.date.getDate() === date.getDate() && 
        event.date.getMonth() === date.getMonth() && 
        event.date.getFullYear() === date.getFullYear()
    );
    
    const dayHeader = document.createElement('h3');
    dayHeader.textContent = date.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' });
    container.appendChild(dayHeader);
    
    if (dayEvents.length === 0) {
        const noEvents = document.createElement('p');
        noEvents.textContent = 'Нет запланированных контактов на этот день';
        container.appendChild(noEvents);
    } else {
        const eventsList = document.createElement('ul');
        eventsList.className = 'day-events';
        
        dayEvents.forEach(event => {
            const eventItem = document.createElement('li');
            eventItem.className = `event-item ${event.status}`;
            eventItem.innerHTML = `
                <span class="event-time">${event.date.toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'})}</span>
                <span class="event-partner">${event.partner}</span>
                <span class="event-priority ${event.priority}">${getPriorityText(event.priority)}</span>
                <span class="event-type">${event.type === 'planned' ? 'Плановый' : 'Внеплановый'}</span>
            `;
            eventsList.appendChild(eventItem);
        });
        
        container.appendChild(eventsList);
    }
}

function renderWeekView(container, date, events) {
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
        const day = new Date(weekStart);
        day.setDate(weekStart.getDate() + i);
        weekDays.push(day);
    }
    
    const weekGrid = document.createElement('div');
    weekGrid.className = 'week-grid';
    
    weekDays.forEach(day => {
        const dayColumn = document.createElement('div');
        dayColumn.className = 'day-column';
        
        const dayHeader = document.createElement('div');
        dayHeader.className = 'day-header';
        dayHeader.textContent = day.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric' });
        dayColumn.appendChild(dayHeader);
        
        const dayEvents = events.filter(event => 
            event.date.getDate() === day.getDate() && 
            event.date.getMonth() === day.getMonth() && 
            event.date.getFullYear() === day.getFullYear()
        );
        
        if (dayEvents.length > 0) {
            dayEvents.forEach(event => {
                const eventItem = document.createElement('div');
                eventItem.className = `event-item ${event.status}`;
                eventItem.innerHTML = `
                    <span class="event-time">${event.date.toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'})}</span>
                    <span class="event-partner">${event.partner}</span>
                `;
                dayColumn.appendChild(eventItem);
            });
        }
        
        weekGrid.appendChild(dayColumn);
    });
    
    container.appendChild(weekGrid);
}

function renderMonthView(container, date, events) {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    // Create month header with day names
    const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    const headerRow = document.createElement('div');
    headerRow.className = 'month-header';
    
    dayNames.forEach(day => {
        const dayCell = document.createElement('div');
        dayCell.className = 'day-name';
        dayCell.textContent = day;
        headerRow.appendChild(dayCell);
    });
    
    container.appendChild(headerRow);
    
    // Create calendar grid
    const monthGrid = document.createElement('div');
    monthGrid.className = 'month-grid';
    
    let day = 1;
    for (let i = 0; i < 6; i++) { // 6 rows to cover all possibilities
        if (day > daysInMonth) break;
        
        const weekRow = document.createElement('div');
        weekRow.className = 'week-row';
        
        for (let j = 0; j < 7; j++) {
            if ((i === 0 && j < startDay - 1) || day > daysInMonth) {
                const emptyCell = document.createElement('div');
                emptyCell.className = 'day-cell empty';
                weekRow.appendChild(emptyCell);
            } else {
                const dayCell = document.createElement('div');
                dayCell.className = 'day-cell';
                
                const dayNumber = document.createElement('div');
                dayNumber.className = 'day-number';
                dayNumber.textContent = day;
                dayCell.appendChild(dayNumber);
                
                // Add events for this day
                const currentDate = new Date(date.getFullYear(), date.getMonth(), day);
                const dayEvents = events.filter(event => 
                    event.date.getDate() === currentDate.getDate() && 
                    event.date.getMonth() === currentDate.getMonth() && 
                    event.date.getFullYear() === currentDate.getFullYear()
                );
                
                if (dayEvents.length > 0) {
                    const eventsIndicator = document.createElement('div');
                    eventsIndicator.className = 'events-indicator';
                    eventsIndicator.textContent = `${dayEvents.length} контактов`;
                    dayCell.appendChild(eventsIndicator);
                    
                    dayCell.classList.add('has-events');
                    
                    // Add status class for styling
                    if (dayEvents.some(e => e.status === 'overdue')) {
                        dayCell.classList.add('has-overdue');
                    } else if (dayEvents.some(e => e.status === 'completed')) {
                        dayCell.classList.add('has-completed');
                    } else {
                        dayCell.classList.add('has-planned');
                    }
                }
                
                weekRow.appendChild(dayCell);
                day++;
            }
        }
        
        monthGrid.appendChild(weekRow);
    }
    
    container.appendChild(monthGrid);
}