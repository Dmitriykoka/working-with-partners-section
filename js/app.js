// Main Application Script
document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    const navItems = document.querySelectorAll('.sidebar li');
    const contentSections = document.querySelectorAll('.content-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section') + '-section';
            
            // Update active nav item
            navItems.forEach(navItem => navItem.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding section
            contentSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === sectionId) {
                    section.classList.add('active');
                }
            });
        });
    });
    
    // Back to dashboard button
    const backButton = document.getElementById('back-to-dashboard');
    if (backButton) {
        backButton.addEventListener('click', function() {
            contentSections.forEach(section => section.classList.remove('active'));
            document.getElementById('dashboard-section').classList.add('active');
            navItems.forEach(navItem => navItem.classList.remove('active'));
            document.querySelector('.sidebar li[data-section="dashboard"]').classList.add('active');
        });
    }
    
    // Modal handling
    const modals = document.querySelectorAll('.modal');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    
    function openModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    }
    
    function closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    }
    
    // Add contact button
    const addContactBtn = document.getElementById('add-contact-btn');
    if (addContactBtn) {
        addContactBtn.addEventListener('click', () => openModal('add-contact-modal'));
    }
    
    // Complete contact button
    const completeContactBtn = document.getElementById('complete-contact-btn');
    if (completeContactBtn) {
        completeContactBtn.addEventListener('click', () => openModal('complete-contact-modal'));
    }
    
    // Reschedule contact button
    const rescheduleContactBtn = document.getElementById('reschedule-contact-btn');
    if (rescheduleContactBtn) {
        rescheduleContactBtn.addEventListener('click', () => openModal('reschedule-contact-modal'));
    }
    
    // Close modals
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal.id);
        });
    });
    
    // Close modal when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });
    
    // Form submissions
    const addContactForm = document.getElementById('add-contact-form');
    if (addContactForm) {
        addContactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Here you would typically send data to server
            alert('Контакт успешно добавлен!');
            closeModal('add-contact-modal');
            this.reset();
        });
    }
    
    const completeContactForm = document.getElementById('complete-contact-form');
    if (completeContactForm) {
        completeContactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Here you would typically send data to server
            alert('Контакт отмечен как выполненный!');
            closeModal('complete-contact-modal');
            this.reset();
        });
    }
    
    const rescheduleContactForm = document.getElementById('reschedule-contact-form');
    if (rescheduleContactForm) {
        rescheduleContactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Here you would typically send data to server
            alert('Встреча перенесена!');
            closeModal('reschedule-contact-modal');
            this.reset();
        });
    }
    
    // Initialize the app
    loadPartners();
    initCalendar();
    initAnalytics();
});