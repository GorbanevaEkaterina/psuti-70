document.addEventListener('DOMContentLoaded', function() {
  const adminBtn = document.getElementById('adminBtn');
  const authModal = document.getElementById('authModal');
  const greetingForm = document.getElementById('greetingForm');
  const deleteConfirmModal = document.getElementById('deleteConfirmModal');
  const addGreetingBtn = document.getElementById('addGreetingBtn');
  const cardsList = document.querySelector('.cards-list');
  const templateEl = document.querySelector('.cards-list template');
  
  const passwordInput = document.getElementById('password');
  const authError = document.getElementById('authError');
  const authSubmit = document.getElementById('authSubmit');
  const greetingFormContent = document.getElementById('greetingFormContent');
  const logoutBtn = document.getElementById('logoutBtn');
  const authModalTitle = document.getElementById('authModalTitle');
  const passwordLabel = document.getElementById('passwordLabel');
  
  const confirmDeleteBtn = document.getElementById('confirmDelete');
  const cancelDeleteBtn = document.getElementById('cancelDelete');
  
  const authCloseBtns = authModal.querySelectorAll('.modal-close');
  const formCloseBtns = greetingForm.querySelectorAll('.modal-close');
  const deleteCloseBtns = deleteConfirmModal.querySelectorAll('.delete-close');
  
  const CORRECT_PASSWORD = 'pguti70';
  
  let greetings = JSON.parse(localStorage.getItem('customGreetings')) || [];
  let greetingToDelete = null;
  let isAdminMode = false;
  
  function renderSavedGreetings() {
    greetings.forEach((greeting, index) => {
      const newCard = createGreetingCard(greeting, index);
      cardsList.insertBefore(newCard, templateEl);
    });
  }
  
  function createGreetingCard(greeting, index) {
    const li = document.createElement('li');
    
    const formattedMessage = greeting.message.replace(/\n/g, '<br>');
    const companyText = greeting.company ? greeting.company : '';
    
    li.innerHTML = `
      <article class="card card_theme_dark">
        <button class="delete-icon" data-index="${index}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
        <div class="card__content">
          <p class="card__text">
            Здравствуй, дорогой ПГУТИ!
          </p>
          <p class="card__text">${formattedMessage}</p>
          <div class="card__author">
            <p class="card__author-name">
              Выпускник ${greeting.year} года,
              ${greeting.name},
            </p>
            <p class="card__author-position">
              ${greeting.position} ${companyText}
            </p>
          </div>
        </div>
      </article>
    `;
    
    if (isAdminMode) {
      const deleteIcon = li.querySelector('.delete-icon');
      deleteIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        openDeleteConfirmModal(index);
      });
    }
    
    return li;
  }
  
  function toggleAdminMode(enable) {
    isAdminMode = enable;
    document.body.classList.toggle('admin-mode', enable);
    
    if (enable) {
      showNotification('Режим администратора активирован');
      passwordLabel.style.display = 'none';
      passwordInput.style.display = 'none';
      authSubmit.style.display = 'none';
      logoutBtn.style.display = 'inline-block';
      authModalTitle.textContent = 'Выход из режима администратора';
    } else {
      showNotification('Режим администратора деактивирован');
      passwordLabel.style.display = 'block';
      passwordInput.style.display = 'block';
      authSubmit.style.display = 'inline-block';
      logoutBtn.style.display = 'none';
      authModalTitle.textContent = 'Администрирование';
    }
  }
  
  function openAuthModal() {
    authModal.style.display = 'flex';
    passwordInput.value = '';
    authError.textContent = '';
    passwordInput.focus();
    passwordLabel.style.display = 'block';
    passwordInput.style.display = 'block';
    authSubmit.style.display = 'inline-block';
    logoutBtn.style.display = 'none';
    authModalTitle.textContent = 'Администрирование';
  }
  
  function closeAuthModal() {
    authModal.style.display = 'none';
  }
  
  function openGreetingForm() {
    greetingForm.style.display = 'flex';
    resetForm();
  }
  
  function closeGreetingForm() {
    greetingForm.style.display = 'none';
    resetForm();
  }
  
  function resetForm() {
    document.getElementById('name').value = '';
    document.getElementById('year').value = '';
    document.getElementById('position').value = '';
    document.getElementById('company').value = '';
    document.getElementById('message').value = '';
  }
  
  function authenticate(e) {
    if (e) e.preventDefault();
    
    if (passwordInput.value.trim() === CORRECT_PASSWORD) {
      toggleAdminMode(true);
      closeAuthModal();
    } else {
      authError.textContent = 'Неверный пароль.';
      passwordInput.focus();
    }
  }
  
  function addGreeting(e) {
    e.preventDefault();
    
    const newGreeting = {
      name: document.getElementById('name').value.trim(),
      year: document.getElementById('year').value.trim(),
      position: document.getElementById('position').value.trim(),
      company: document.getElementById('company').value.trim(),
      message: document.getElementById('message').value.trim(),
      timestamp: new Date().toISOString()
    };
    
    if (!newGreeting.name || !newGreeting.year || !newGreeting.position || !newGreeting.message) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }
    
    greetings.unshift(newGreeting);
    localStorage.setItem('customGreetings', JSON.stringify(greetings));
    renderAllGreetings();
    closeGreetingForm();
    showNotification('Поздравление успешно добавлено!');
  }
  
  function openDeleteConfirmModal(index) {
    greetingToDelete = index;
    deleteConfirmModal.style.display = 'flex';
  }
  
  function closeDeleteModal() {
    deleteConfirmModal.style.display = 'none';
    greetingToDelete = null;
  }
  
  function confirmDelete(e) {
    if (e) e.preventDefault();
    
    if (greetingToDelete !== null) {
      greetings.splice(greetingToDelete, 1);
      localStorage.setItem('customGreetings', JSON.stringify(greetings));
      renderAllGreetings();
      showNotification('Поздравление успешно удалено!');
    }
    closeDeleteModal();
  }
  
  function renderAllGreetings() {
    const existingCards = cardsList.querySelectorAll('li:not(template)');
    existingCards.forEach(card => card.remove());
    renderSavedGreetings();
  }
  
  function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #1e3c72;
      color: white;
      padding: 15px 25px;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      z-index: 3000;
      font-size: 16px;
      transform: translateX(400px);
      transition: transform 0.4s ease-out;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(() => {
      notification.style.transform = 'translateX(400px)';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 400);
    }, 3000);
  }
  
  adminBtn.addEventListener('click', function() {
    if (isAdminMode) {
      authModal.style.display = 'flex';
      passwordLabel.style.display = 'none';
      passwordInput.style.display = 'none';
      authSubmit.style.display = 'none';
      logoutBtn.style.display = 'inline-block';
      authModalTitle.textContent = 'Выход из режима администратора';
    } else {
      openAuthModal();
    }
  });
  
  addGreetingBtn.addEventListener('click', openGreetingForm);
  authSubmit.addEventListener('click', authenticate);
  passwordInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') authenticate();
  });
  
  logoutBtn.addEventListener('click', function() {
    toggleAdminMode(false);
    closeAuthModal();
    location.reload();
  });
  
  authCloseBtns.forEach(btn => {
    btn.addEventListener('click', closeAuthModal);
  });
  
  formCloseBtns.forEach(btn => {
    btn.addEventListener('click', closeGreetingForm);
  });
  
  authModal.addEventListener('click', (e) => {
    if (e.target === authModal) closeAuthModal();
  });
  
  greetingForm.addEventListener('click', (e) => {
    if (e.target === greetingForm) closeGreetingForm();
  });
  
  greetingFormContent.addEventListener('submit', addGreeting);
  
  confirmDeleteBtn.addEventListener('click', confirmDelete);
  cancelDeleteBtn.addEventListener('click', closeDeleteModal);
  
  deleteCloseBtns.forEach(btn => {
    btn.addEventListener('click', closeDeleteModal);
  });
  
  deleteConfirmModal.addEventListener('click', (e) => {
    if (e.target === deleteConfirmModal) closeDeleteModal();
  });
  
  renderSavedGreetings();
});