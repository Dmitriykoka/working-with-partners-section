// Генерация тестовых данных
function generateTestData() {
    const partners = [];
    const categories = ['A', 'B', 'C', 'D', 'lead', 'pause'];
    const statuses = ['active', 'paused', 'archived'];
    const managers = ['Иванов А.И.', 'Петров С.К.'];
    const contactMethods = ['Звонок', 'Email', 'Telegram', 'WhatsApp', 'Личная встреча'];
    
    // Генерация партнеров
    for (let i = 1; i <= 50; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const manager = managers[Math.floor(Math.random() * managers.length)];
        
        partners.push({
            id: i,
            inn: (1000000000 + Math.floor(Math.random() * 9000000000)).toString(),
            name: i % 2 === 0 ? `ООО "Компания ${i}"` : `ИП Фамилия ${i}`,
            category: category,
            status: status,
            contractDate: randomDate(new Date(2020, 0, 1), new Date()).toISOString().split('T')[0],
            registrationDate: randomDate(new Date(2018, 0, 1), new Date(2020, 0, 1)).toISOString().split('T')[0],
            manager: manager,
            activeClients: Math.floor(Math.random() * 200),
            newClients12m: Math.floor(Math.random() * 50),
            profit12m: Math.floor(Math.random() * 5000000) + 100000
        });
    }
    
    // Генерация контактов
    const contacts = [];
    const contactTypes = ['planned', 'unscheduled'];
    
    partners.forEach(partner => {
        const contactsCount = 3 + Math.floor(Math.random() * 10);
        for (let i = 0; i < contactsCount; i++) {
            contacts.push({
                id: contacts.length + 1,
                partnerId: partner.id,
                partnerName: partner.name,
                date: randomDate(new Date(2023, 0, 1), new Date()).toISOString().split('T')[0],
                time: randomTime(),
                type: contactTypes[Math.floor(Math.random() * contactTypes.length)],
                method: contactMethods[Math.floor(Math.random() * contactMethods.length)],
                comment: `Комментарий к контакту ${i + 1} с ${partner.name}`,
                manager: partner.manager,
                category: partner.category
            });
        }
    });
    
    return { partners, contacts };
}

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomTime() {
    const hours = String(Math.floor(Math.random() * 24)).padStart(2, '0');
    const minutes = String(Math.floor(Math.random() * 60)).padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Загрузка данных
function loadPartners() {
    const data = generateTestData();
    return data.partners;
}

function loadContacts() {
    const data = generateTestData();
    return data.contacts;
}

// Вспомогательные функции
function formatDate(dateStr) {
    if (!dateStr || isNaN(new Date(dateStr))) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU');
}

function formatCurrency(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function getStatusText(status) {
    switch (status) {
        case 'active': return 'Активен';
        case 'paused': return 'На паузе';
        case 'archived': return 'Архив';
        default: return status;
    }
}

function getCategoryClass(category) {
    return `category-${category.toLowerCase()}`;
}

export { 
    loadPartners, 
    loadContacts, 
    formatDate, 
    formatCurrency, 
    getStatusText, 
    getCategoryClass 
};