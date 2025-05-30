import { loadContacts, formatDate } from './data.js';

let currentContacts = [];

function initContacts() {
    currentContacts = loadContacts();
    renderContactsTable(currentContacts);
    setupEventHandlers();
}

function setupEventHandlers() {
    // Фильтры
    document.getElementById('apply-contact-filters').addEventListener('click', applyFilters);
    document.getElementById('reset-contact-filters').addEventListener('click', resetFilters);
    
    // Инициализация Flatpickr
    flatpickr('#contact-date-from', {
        dateFormat: 'Y-m-d',
        locale: 'ru'
    });
    
    flatpickr('#contact-date-to', {
        dateFormat: 'Y-m-d',
        locale: 'ru'
    });
}

function renderContactsTable(contacts) {
    const tableBody = document.querySelector('#contacts-table tbody');
    tableBody.innerHTML = '';
    
    if (contacts.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="text-center">Нет данных о контактах</td></tr>';
        return;
    }
    
    contacts.forEach(contact => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${contact.partnerName}</td>
            <td>${contact.category}</td>
            <td>${contact.type === 'planned' ? 'Плановый' : 'Внеплановый'}</td>
            <td>${contact.method}</td>
            <td>${formatDate(contact.date)} ${contact.time}</td>
            <td>${contact.comment}</td>
            <td>${contact.manager}</td>
        `;
        
        tableBody.appendChild(row);
    });
}

function applyFilters() {
    const managerFilter = document.getElementById('contact-manager-filter').value;
    const dateFrom = document.getElementById('contact-date-from').value;
    const dateTo = document.getElementById('contact-date-to').value;
    
    let filtered = [...currentContacts];
    
    if (managerFilter !== 'all') {
        filtered = filtered.filter(c => c.manager === managerFilter);
    }
    
    if (dateFrom) {
        filtered = filtered.filter(c => c.date >= dateFrom);
    }
    
    if (dateTo) {
        filtered = filtered.filter(c => c.date <= dateTo);
    }
    
    renderContactsTable(filtered);
}

function resetFilters() {
    document.getElementById('contact-manager-filter').value = 'all';
    document.getElementById('contact-date-from').value = '';
    document.getElementById('contact-date-to').value = '';
    renderContactsTable(currentContacts);
}

export { initContacts };