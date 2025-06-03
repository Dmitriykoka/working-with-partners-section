import { loadContacts, loadPartners, formatDate } from './data.js';

let currentDate = new Date();
let currentView = 'month';
let contacts = [];
let partners = [];

function initCalendar() {
    contacts = loadContacts();
    partners = loadPartners();
    
    renderCalendar();
    setupEventHandlers();
}

function setupEventHandlers() {
    // Переключение вида
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentView = this.getAttribute('data-view');
            renderCalendar();
        });
    });
    
    // Навигация
    document.getElementById('prev-period').addEventListener('click', function() {
        navigate(-1);
    });
    
    document.getElementById('next-period').addEventListener('click', function() {
        navigate(1);
    });
    
    // Добавление контакта
    document.getElementById('add-contact-btn').addEventListener('click', function() {
        window.showModal('add-contact-modal');
    });
}


function navigate(direction) {
    if (currentView === 'month') {
        currentDate.setMonth(currentDate.getMonth() + direction);
    } else if (currentView === 'week') {
        currentDate.setDate(currentDate.getDate() + (7 * direction));
    } else {
        currentDate.setDate(currentDate.getDate() + direction);
    }
    renderCalendar();
}

function renderCalendar() {
    const calendarEl = document.getElementById('calendar');
    const periodTitleEl = document.getElementById('current-period');
    
    if (currentView === 'month') {
        renderMonthView(calendarEl, periodTitleEl);
    } else if (currentView === 'week') {
        renderWeekView(calendarEl, periodTitleEl);
    } else {
        renderDayView(calendarEl, periodTitleEl);
    }
}

function renderMonthView(calendarEl, periodTitleEl) {
    const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 
                       'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    periodTitleEl.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    
    // Получаем первый и последний день месяца
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    // Определяем день недели первого дня месяца (0-6, где 0 - воскресенье)
    let firstDayOfWeek = firstDay.getDay();
    // Корректируем для отображения понедельника первым днем
    if (firstDayOfWeek === 0) firstDayOfWeek = 6;
    else firstDayOfWeek--;

    // Получаем количество дней в предыдущем месяце
    const prevLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
    
    let calendarHtml = `
        <div class="calendar-grid">
            <div class="calendar-day-header">Пн</div>
            <div class="calendar-day-header">Вт</div>
            <div class="calendar-day-header">Ср</div>
            <div class="calendar-day-header">Чт</div>
            <div class="calendar-day-header">Пт</div>
            <div class="calendar-day-header">Сб</div>
            <div class="calendar-day-header">Вс</div>
            
            <div class="calendar-legend">
                <div><span class="legend-color category-a"></span> Категория A</div>
                <div><span class="legend-color category-b"></span> Категория B</div>
                <div><span class="legend-color category-c"></span> Категория C</div>
                <div><span class="legend-color category-d"></span> Категория D</div>
                <div><span class="legend-color category-lead"></span> Лиды</div>
                <div><span class="legend-color category-pause"></span> На паузе</div>
            </div>
    `;
    
    // Добавляем пустые ячейки для дней предыдущего месяца
    for (let i = firstDayOfWeek; i > 0; i--) {
        calendarHtml += `<div class="calendar-day empty">${prevLastDay - i + 1}</div>`;
    }
    
    // Добавляем дни текущего месяца
    for (let i = 1; i <= lastDay.getDate(); i++) {
        const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
        const dateStr = dayDate.toISOString().split('T')[0];
        
        // Получаем контакты на этот день
        const dayContacts = contacts.filter(c => c.date === dateStr);
        
        // Определяем классы для дня
        let dayClasses = 'calendar-day';
        const today = new Date();
        if (dayDate.getDate() === today.getDate() && 
            dayDate.getMonth() === today.getMonth() && 
            dayDate.getFullYear() === today.getFullYear()) {
            dayClasses += ' current-day';
        }
        
        // Формируем HTML для контактов
        let contactsHtml = '';
        if (dayContacts.length > 0) {
            contactsHtml = `<div class="day-contacts">`;
            
            // Ограничиваем количество отображаемых контактов
            const contactsToShow = dayContacts.slice(0, 2);
            const hiddenContactsCount = dayContacts.length - contactsToShow.length;
            
            contactsToShow.forEach(contact => {
                const partner = partners.find(p => p.id === contact.partnerId);
                contactsHtml += `
                    <div class="contact-badge event-category-${contact.category.toLowerCase()}" 
                         title="${partner?.name || 'Партнер'}\n${contact.time} - ${contact.method}">
                        ${contact.time} - ${partner?.name?.split(' ')[0] || 'Партнер'}
                    </div>
                `;
            });
            
            if (hiddenContactsCount > 0) {
                contactsHtml += `
                    <div class="more-contacts" title="Еще ${hiddenContactsCount} контактов">
                        +${hiddenContactsCount}
                    </div>
                `;
            }
            
            contactsHtml += `</div>`;
        }
        
        calendarHtml += `
            <div class="${dayClasses}" data-date="${dateStr}">
                <div class="calendar-date">${i}</div>
                ${contactsHtml}
            </div>
        `;
    }
    
    // Добавляем дни следующего месяца до завершения сетки
    const totalCells = firstDayOfWeek + lastDay.getDate();
    const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    
    for (let i = 1; i <= remainingCells; i++) {
        calendarHtml += `<div class="calendar-day empty">${i}</div>`;
    }
    
    calendarHtml += `</div>`;
    calendarEl.innerHTML = calendarHtml;
    
    // Добавляем обработчики событий для дней
    document.querySelectorAll('.calendar-day:not(.empty)').forEach(day => {
        day.addEventListener('click', function() {
            const dateStr = this.getAttribute('data-date');
            showDayEvents(dateStr);
        });
    });
}

function renderWeekView(calendarEl, periodTitleEl) {
    // Находим понедельник текущей недели
    const monday = new Date(currentDate);
    monday.setDate(currentDate.getDate() - (currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1));
    
    // Находим воскресенье текущей недели
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    // Устанавливаем заголовок
    periodTitleEl.textContent = `${formatDate(monday)} - ${formatDate(sunday)}`;
    
    let calendarHtml = '<div class="week-view">';
    
    // Добавляем дни недели
    for (let i = 0; i < 7; i++) {
        const day = new Date(monday);
        day.setDate(monday.getDate() + i);
        const dateStr = day.toISOString().split('T')[0];
        
        // Получаем контакты на этот день
        const dayContacts = contacts.filter(c => c.date === dateStr);
        
        // Определяем классы для дня
        let dayClasses = 'week-day';
        const today = new Date();
        if (day.getDate() === today.getDate() && 
            day.getMonth() === today.getMonth() && 
            day.getFullYear() === today.getFullYear()) {
            dayClasses += ' current-day';
        }
        
        // Формируем HTML для контактов
        let contactsHtml = '';
        if (dayContacts.length > 0) {
            contactsHtml = '<div class="day-events">';
            
            // Сортируем контакты по времени
            dayContacts.sort((a, b) => a.time.localeCompare(b.time));
            
            dayContacts.forEach(contact => {
                const partner = partners.find(p => p.id === contact.partnerId);
                contactsHtml += `
                    <div class="week-event event-category-${contact.category.toLowerCase()}" 
                         data-contact-id="${contact.id}">
                        <span class="event-time">${contact.time}</span>
                        <span class="event-partner">${partner?.name || 'Партнер'}</span>
                        <span class="event-method">${contact.method}</span>
                    </div>
                `;
            });
            
            contactsHtml += '</div>';
        }
        
        // Добавляем день в календарь
        const dayNames = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
        calendarHtml += `
            <div class="${dayClasses}" data-date="${dateStr}">
                <div class="day-header">
                    <span class="day-name">${dayNames[i]}</span>
                    <span class="day-date">${formatDate(day)}</span>
                </div>
                ${contactsHtml}
            </div>
        `;
    }
    
    calendarHtml += '</div>';
    calendarEl.innerHTML = calendarHtml;
    
    // Добавляем обработчики событий
    document.querySelectorAll('.week-day').forEach(day => {
        day.addEventListener('click', function() {
            const dateStr = this.getAttribute('data-date');
            showDayEvents(dateStr);
        });
    });
    
    document.querySelectorAll('.week-event').forEach(event => {
        event.addEventListener('click', function(e) {
            e.stopPropagation();
            const contactId = parseInt(this.getAttribute('data-contact-id'));
            showContactDetails(contactId);
        });
    });
}

function renderDayView(calendarEl, periodTitleEl) {
    const dateStr = currentDate.toISOString().split('T')[0];
    periodTitleEl.textContent = formatDate(currentDate);
    
    // Получаем контакты на этот день
    const dayContacts = contacts.filter(c => c.date === dateStr);
    
    let calendarHtml = '<div class="day-view">';
    
    if (dayContacts.length === 0) {
        calendarHtml += '<div class="no-events">Нет запланированных контактов</div>';
    } else {
        // Сортируем контакты по времени
        dayContacts.sort((a, b) => a.time.localeCompare(b.time));
        
        dayContacts.forEach(contact => {
            const partner = partners.find(p => p.id === contact.partnerId);
            calendarHtml += `
                <div class="day-event event-category-${contact.category.toLowerCase()}" 
                     data-contact-id="${contact.id}">
                    <div class="event-time">${contact.time}</div>
                    <div class="event-details">
                        <div class="event-partner">${partner?.name || 'Партнер'}</div>
                        <div class="event-method">${contact.method}</div>
                        <div class="event-type">${contact.type === 'planned' ? 'Плановый' : 'Внеплановый'}</div>
                    </div>
                    <div class="event-comment">${contact.comment}</div>
                </div>
            `;
        });
    }
    
    calendarHtml += '</div>';
    calendarEl.innerHTML = calendarHtml;
    
    // Добавляем обработчики событий
    document.querySelectorAll('.day-event').forEach(event => {
        event.addEventListener('click', function() {
            const contactId = parseInt(this.getAttribute('data-contact-id'));
            showContactDetails(contactId);
        });
    });
}

function showDayEvents(dateStr) {
    document.getElementById('selected-day-title').textContent = formatDate(new Date(dateStr));
    
    // Получаем контакты на этот день
    const dayContacts = contacts.filter(c => c.date === dateStr);
    const eventsList = document.getElementById('day-events-list');
    
    if (dayContacts.length === 0) {
        eventsList.innerHTML = '<div class="no-events">Нет запланированных контактов</div>';
        return;
    }
    
    // Сортируем контакты по времени
    dayContacts.sort((a, b) => a.time.localeCompare(b.time));
    
    let eventsHtml = '';
    dayContacts.forEach(contact => {
        const partner = partners.find(p => p.id === contact.partnerId);
        eventsHtml += `
            <div class="event-item event-category-${contact.category.toLowerCase()}" 
                 data-contact-id="${contact.id}">
                <span class="event-time">${contact.time}</span>
                <span class="event-partner">${partner?.name || 'Партнер'}</span>
                <span class="event-method">${contact.method}</span>
                <div class="event-actions">
                    <button class="complete-contact" title="Отметить выполненным"><i class="fas fa-check"></i></button>
                </div>
            </div>
        `;
    });
    
    eventsList.innerHTML = eventsHtml;
    
    // Добавляем обработчики для кнопок
    document.querySelectorAll('.complete-contact').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const contactId = parseInt(this.closest('.event-item').getAttribute('data-contact-id'));
            completeContact(contactId);
        });
    });
}

function showContactDetails(contactId) {
    const contact = contacts.find(c => c.id === contactId);
    if (!contact) return;
    
    const partner = partners.find(p => p.id === contact.partnerId);
    
    // Заполняем модальное окно (реализация зависит от вашего HTML)
    console.log('Показ деталей контакта:', contact);
    // В реальном приложении здесь было бы открытие модального окна с деталями
}

function completeContact(contactId) {
    // В реальном приложении здесь был бы запрос к API
    console.log('Контакт выполнен:', contactId);
    alert('Контакт успешно отмечен как выполненный');
    // Обновляем отображение
}

// Вспомогательная функция для форматирования даты
/*function formatDate(date) {
    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}*/
export { initCalendar };