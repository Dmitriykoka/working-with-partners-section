import { initPartners } from './partners.js';
import { initContacts } from './contacts.js';
import { initCalendar } from './calendar.js';
import { initReports } from './reports.js';

let isInitialized = false;

document.addEventListener('DOMContentLoaded', async function() {
    if (isInitialized) return;
    
    try {
        await initPartners();
        await initContacts();
        await initCalendar();
        await initReports();
        
        setupNavigation();
        setupModals();
        isInitialized = true;
    } catch (error) {
        console.error('Ошибка при инициализации приложения:', error);
        alert('Произошла ошибка при загрузке приложения. Пожалуйста, обновите страницу.');
    }
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
            const section = document.getElementById(sectionId);
            if (section) section.classList.add('active');
        });
    });
}

function setupModals() {
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            hideModal(this.closest('.modal'));
        });
    });
    
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