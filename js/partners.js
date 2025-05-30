import { 
    loadPartners, 
    loadContacts, 
    formatDate, 
    formatCurrency, 
    getStatusText, 
    getCategoryClass 
} from './data.js';

let currentPartners = [];
let currentContacts = [];
let currentPartnerId = null;

function initPartners() {
    currentPartners = loadPartners();
    currentContacts = loadContacts();
    
    renderPartnersTable(currentPartners);
    checkUserRole();
    setupEventHandlers();
}

function checkUserRole() {
    const isManager = document.getElementById('current-user').textContent.includes('Менеджер');
    if (!isManager) {
        document.querySelector('.manager-filter').style.display = 'block';
    }
}

function setupEventHandlers() {
    // Фильтры
    document.getElementById('apply-filters').addEventListener('click', applyFilters);
    document.getElementById('reset-filters').addEventListener('click', resetFilters);
    
    // Сортировка
    document.querySelectorAll('.sortable').forEach(th => {
        th.addEventListener('click', function() {
            const sortField = this.getAttribute('data-sort');
            sortTable(sortField);
        });
    });
    
    // Клик по строке таблицы
    document.getElementById('partners-table').addEventListener('click', function(e) {
        const row = e.target.closest('tr[data-partner-id]');
        if (row) {
            const partnerId = parseInt(row.getAttribute('data-partner-id'));
            showPartnerDetails(partnerId);
        }
    });
    
    // Кнопка добавления контакта
    document.getElementById('schedule-contact').addEventListener('click', function() {
        currentPartnerId = null; // Сбрасываем выбранного партнера
        showAddContactModal();
    });
    document.getElementById('schedule-contact').addEventListener('click', showAddContactModal);
    
    // Модальные окна
    document.getElementById('change-category-btn').addEventListener('click', showChangeCategoryModal);
    document.getElementById('view-history-btn').addEventListener('click', showContactHistory);
    document.getElementById('add-contact-btn').addEventListener('click', showAddContactModal);
    
    // Изменение категории
    document.getElementById('new-category').addEventListener('change', function() {
        document.getElementById('reason-container').style.display = 
            this.value === 'D' ? 'block' : 'none';
    });
    
    document.getElementById('category-form').addEventListener('submit', function(e) {
        e.preventDefault();
        changePartnerCategory();
    });
}

function renderPartnersTable(partners) {
    const tableBody = document.querySelector('#partners-table tbody');
    tableBody.innerHTML = '';
    
    if (partners.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="10" class="text-center">Нет данных о партнерах</td></tr>';
        return;
    }
    
    partners.forEach(partner => {
        const row = document.createElement('tr');
        row.setAttribute('data-partner-id', partner.id);
        
        row.innerHTML = `
            <td>${partner.inn}</td>
            <td>${partner.name}</td>
            <td><span class="category-badge ${getCategoryClass(partner.category)}">${partner.category}</span></td>
            <td><span class="status-badge status-${partner.status}">${getStatusText(partner.status)}</span></td>
            <td>${formatDate(partner.contractDate)}</td>
            <td>${formatDate(partner.registrationDate)}</td>
            <td>${partner.manager}</td>
            <td>${partner.activeClients}</td>
            <td>${partner.newClients12m}</td>
            <td>${formatCurrency(partner.profit12m)} руб.</td>
        `;
        
        tableBody.appendChild(row);
    });
}

function applyFilters() {
    const categoryFilter = document.getElementById('category-filter').value;
    const statusFilter = document.getElementById('status-filter').value;
    const managerFilter = document.getElementById('manager-filter')?.value || 'all';
    
    let filtered = [...currentPartners];
    
    if (categoryFilter !== 'all') {
        filtered = filtered.filter(p => p.category === categoryFilter);
    }
    
    if (statusFilter !== 'all') {
        filtered = filtered.filter(p => p.status === statusFilter);
    }
    
    if (managerFilter !== 'all') {
        filtered = filtered.filter(p => p.manager === managerFilter);
    }
    
    renderPartnersTable(filtered);
}

function resetFilters() {
    document.getElementById('category-filter').value = 'all';
    document.getElementById('status-filter').value = 'all';
    if (document.getElementById('manager-filter')) {
        document.getElementById('manager-filter').value = 'all';
    }
    renderPartnersTable(currentPartners);
}

function sortTable(sortField) {
    const sorted = [...currentPartners].sort((a, b) => {
        if (sortField === 'category' || sortField === 'status') {
            return a[sortField].localeCompare(b[sortField]);
        } else if (sortField === 'contractDate') {
            return new Date(a[sortField]) - new Date(b[sortField]);
        } else {
            return a[sortField] - b[sortField];
        }
    });
    
    renderPartnersTable(sorted);
}

function showPartnerDetails(partnerId) {
    const partner = currentPartners.find(p => p.id === partnerId);
    if (!partner) return;
    
    currentPartnerId = partnerId;
    
    // Заполняем модальное окно
    document.getElementById('detail-inn').textContent = partner.inn;
    document.getElementById('detail-name').textContent = partner.name;
    document.getElementById('detail-category').textContent = partner.category;
    document.getElementById('detail-status').textContent = getStatusText(partner.status);
    document.getElementById('detail-contract-date').textContent = formatDate(partner.contractDate);
    document.getElementById('detail-registration-date').textContent = formatDate(partner.registrationDate);
    document.getElementById('detail-manager').textContent = partner.manager;
    document.getElementById('detail-active-clients').textContent = partner.activeClients;
    document.getElementById('detail-new-clients').textContent = partner.newClients12m;
    document.getElementById('detail-profit').textContent = `${formatCurrency(partner.profit12m)} руб.`;
    
    showModal('partner-details-modal');
}

function showContactHistory() {
    if (!currentPartnerId) return;
    
    const partner = currentPartners.find(p => p.id === currentPartnerId);
    if (!partner) return;
    
    // Фильтруем контакты по партнеру
    const partnerContacts = currentContacts.filter(c => c.partnerId === currentPartnerId);
    
    // Заполняем таблицу истории
    const tableBody = document.querySelector('#history-table tbody');
    tableBody.innerHTML = '';
    
    partnerContacts.forEach(contact => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(contact.date)} ${contact.time}</td>
            <td>${contact.type === 'planned' ? 'Плановый' : 'Внеплановый'}</td>
            <td>${contact.method}</td>
            <td>${contact.comment}</td>
            <td>${contact.manager}</td>
        `;
        tableBody.appendChild(row);
    });
    
    // Показываем модальное окно
    showModal('history-modal');
}

function showChangeCategoryModal() {
    if (!currentPartnerId) return;
    
    // Сбрасываем форму
    document.getElementById('new-category').value = '';
    document.getElementById('reason').value = '';
    document.getElementById('reason-container').style.display = 'none';
    
    showModal('change-category-modal');
}

function changePartnerCategory() {
    const newCategory = document.getElementById('new-category').value;
    const reason = document.getElementById('reason').value;
    
    if (!newCategory) return;
    
    // В реальном приложении здесь был бы запрос к API
    const partnerIndex = currentPartners.findIndex(p => p.id === currentPartnerId);
    if (partnerIndex !== -1) {
        currentPartners[partnerIndex].category = newCategory;
        
        // Обновляем отображение
        const categoryElement = document.getElementById('detail-category');
        if (categoryElement) {
            categoryElement.textContent = newCategory;
        }
        
        // Обновляем таблицу
        renderPartnersTable(currentPartners);
        
        alert('Категория успешно изменена');
        hideModal(document.getElementById('change-category-modal'));
    }
}

function showAddContactModal() {
    // Заполняем список партнеров
    const partnerSelect = document.getElementById('contact-partner');
    partnerSelect.innerHTML = '<option value="">Выберите партнера</option>';
    
    currentPartners.forEach(partner => {
        const option = document.createElement('option');
        option.value = partner.id;
        option.textContent = partner.name;
        if (currentPartnerId && partner.id === currentPartnerId) {
            option.selected = true;
        }
        partnerSelect.appendChild(option);
    });
    
    // Сбрасываем форму
    document.getElementById('contact-form').reset();
    
    // Инициализируем Flatpickr
    flatpickr('#contact-date', {
        dateFormat: 'Y-m-d',
        locale: 'ru',
        defaultDate: 'today'
    });
    
    flatpickr('#contact-time', {
        enableTime: true,
        noCalendar: true,
        dateFormat: 'H:i',
        time_24hr: true,
        defaultDate: '09:00'
    });
    
    showModal('add-contact-modal');
}

export { initPartners };