// Partners Management Script
function loadPartners() {
    // In a real app, this would be an API call
    const partners = [
        {
            id: 1,
            name: 'ООО "Технологии Будущего"',
            manager: 'Иванов И.',
            status: 'call',
            priority: 'high',
            type: 'planned',
            contactDate: '2023-05-20T14:00',
            contactPerson: 'Сидоров П.А.',
            phone: '+7 (123) 456-78-90',
            email: 'sidorov@futuretech.ru'
        },
        {
            id: 2,
            name: 'АО "Инновационные Решения"',
            manager: 'Петров А.',
            status: 'planned',
            priority: 'medium',
            type: 'planned',
            contactDate: '2023-05-22T10:30',
            contactPerson: 'Козлова М.В.',
            phone: '+7 (987) 654-32-10',
            email: 'kozlova@innov.ru'
        },
        {
            id: 3,
            name: 'ИП Сергеев К.Д.',
            manager: 'Иванов И.',
            status: 'overdue',
            priority: 'high',
            type: 'unplanned',
            contactDate: '2023-05-15T16:00',
            contactPerson: 'Сергеев К.Д.',
            phone: '+7 (555) 123-45-67',
            email: 'sergeev@ip.ru'
        },
        {
            id: 4,
            name: 'ЗАО "ТехноПрогресс"',
            manager: 'Петров А.',
            status: 'completed',
            priority: 'low',
            type: 'planned',
            contactDate: '2023-05-10T11:00',
            contactPerson: 'Федорова Е.П.',
            phone: '+7 (444) 789-01-23',
            email: 'fedorova@techprog.ru'
        }
    ];
    
    // Populate partners table
    const tableBody = document.getElementById('partners-table-body');
    tableBody.innerHTML = '';
    
    partners.forEach(partner => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${partner.name}</td>
            <td>${partner.manager}</td>
            <td><span class="status-badge status-${partner.status}">${getStatusText(partner.status)}</span></td>
            <td><span class="priority-badge priority-${partner.priority}">${getPriorityText(partner.priority)}</span></td>
            <td>${partner.type === 'planned' ? 'Плановый' : 'Внеплановый'}</td>
            <td>${formatDate(partner.contactDate)}</td>
            <td><button class="view-partner-btn" data-id="${partner.id}">Просмотр</button></td>
        `;
        tableBody.appendChild(row);
    });
    
    // Add event listeners to view buttons
    document.querySelectorAll('.view-partner-btn').forEach(button => {
        button.addEventListener('click', function() {
            const partnerId = parseInt(this.getAttribute('data-id'));
            showPartnerCard(partnerId);
        });
    });
    
    // Populate partner dropdown in add contact modal
    const partnerSelect = document.getElementById('contact-partner');
    partners.forEach(partner => {
        const option = document.createElement('option');
        option.value = partner.id;
        option.textContent = partner.name;
        partnerSelect.appendChild(option);
    });
}

function showPartnerCard(partnerId) {
    // In a real app, this would be an API call to get partner details
    const partner = {
        id: partnerId,
        name: partnerId === 1 ? 'ООО "Технологии Будущего"' : 
              partnerId === 2 ? 'АО "Инновационные Решения"' : 
              partnerId === 3 ? 'ИП Сергеев К.Д.' : 'ЗАО "ТехноПрогресс"',
        contactPerson: partnerId === 1 ? 'Сидоров П.А.' : 
                     partnerId === 2 ? 'Козлова М.В.' : 
                     partnerId === 3 ? 'Сергеев К.Д.' : 'Федорова Е.П.',
        phone: partnerId === 1 ? '+7 (123) 456-78-90' : 
               partnerId === 2 ? '+7 (987) 654-32-10' : 
               partnerId === 3 ? '+7 (555) 123-45-67' : '+7 (444) 789-01-23',
        email: partnerId === 1 ? 'sidorov@futuretech.ru' : 
               partnerId === 2 ? 'kozlova@innov.ru' : 
               partnerId === 3 ? 'sergeev@ip.ru' : 'fedorova@techprog.ru',
        lastContactDate: '15.05.2023',
        nextPlannedContact: '20.05.2023, 14:00',
        overdueContacts: partnerId === 3 ? ['15.05.2023, 16:00'] : [],
        contactHistory: [
            {
                date: '15.05.2023, 16:00',
                type: 'Внеплановый',
                status: 'Просрочено',
                priority: 'Высокая',
                comment: 'Обсуждение новых условий сотрудничества'
            },
            {
                date: '10.05.2023, 11:00',
                type: 'Плановый',
                status: 'Завершено',
                priority: 'Средняя',
                comment: 'Еженедельный созвон'
            },
            {
                date: '03.05.2023, 14:30',
                type: 'Плановый',
                status: 'Завершено',
                priority: 'Низкая',
                comment: 'Уточнение деталей договора'
            }
        ]
    };
    
    // Update partner info
    document.getElementById('partner-name').textContent = partner.name;
    document.getElementById('contact-person').textContent = partner.contactPerson;
    document.getElementById('contact-phone').textContent = partner.phone;
    document.getElementById('contact-email').textContent = partner.email;
    document.getElementById('last-contact-date').textContent = partner.lastContactDate;
    document.getElementById('next-planned-contact').textContent = partner.nextPlannedContact;
    
    // Update overdue contacts
    const overdueList = document.getElementById('overdue-contacts-list');
    overdueList.innerHTML = '';
    if (partner.overdueContacts.length > 0) {
        partner.overdueContacts.forEach(contact => {
            const li = document.createElement('li');
            li.textContent = contact;
            overdueList.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.textContent = 'Нет просроченных контактов';
        overdueList.appendChild(li);
    }
    
    // Update contact history
    const historyTable = document.querySelector('#contact-history-table tbody');
    historyTable.innerHTML = '';
    partner.contactHistory.forEach(contact => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${contact.date}</td>
            <td>${contact.type}</td>
            <td>${contact.status}</td>
            <td>${contact.priority}</td>
            <td>${contact.comment}</td>
        `;
        historyTable.appendChild(row);
    });
    
    // Show partner card
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById('partner-card-section').classList.add('active');
}

// Helper functions
function getStatusText(status) {
    switch(status) {
        case 'call': return 'Нужно позвонить';
        case 'planned': return 'Запланировано';
        case 'overdue': return 'Просрочено';
        case 'completed': return 'Завершено';
        default: return status;
    }
}

function getPriorityText(priority) {
    switch(priority) {
        case 'high': return 'Высокая';
        case 'medium': return 'Средняя';
        case 'low': return 'Низкая';
        default: return priority;
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU') + ', ' + date.toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'});
}