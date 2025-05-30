import { initPartners } from './partners.js';
import { initContacts } from './contacts.js';
import { initCalendar } from './calendar.js';
import { initReports } from './reports.js';

document.addEventListener('DOMContentLoaded', function() {
    initPartners();
    initContacts();
    initCalendar();
    initReports();
    
    setupNavigation();
    setupModals();
});

function setupNavigation() {
    const menuItems = document.querySelectorAll('.sidebar li');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            menuItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            
            const sectionId = this.getAttribute('data-section') + '-section';
            document.getElementById(sectionId).classList.add('active');
        });
    });
}

function setupModals() {
    // Закрытие модальных окон
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            hideModal(this.closest('.modal'));
        });
    });
    
    // Клик вне модального окна
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                hideModal(this);
            }
        });
    });
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function hideModal(modal) {
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Глобальные функции для использования в других модулях
window.showModal = showModal;
window.hideModal = hideModal;

document.addEventListener('DOMContentLoaded', async function() {
    try {
        await initPartners();
        await initContacts();
        await initCalendar();
        await initReports();
        
        setupNavigation();
        setupModals();
    } catch (error) {
        console.error('Ошибка при инициализации приложения:', error);
        alert('Произошла ошибка при загрузке приложения. Пожалуйста, обновите страницу.');
    }
});