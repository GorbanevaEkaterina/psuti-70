document.addEventListener('DOMContentLoaded', function() {
  const addGreetingBtn = document.getElementById('addGreetingBtn');
  const authModal = document.getElementById('authModal');
  const greetingForm = document.getElementById('greetingForm');
  const cardsList = document.querySelector('.cards-list');
  const templateEl = document.querySelector('.cards-list template');
  
  const passwordInput = document.getElementById('password');
  const authError = document.getElementById('authError');
  const authSubmit = document.getElementById('authSubmit');
  const greetingFormContent = document.getElementById('greetingFormContent');
  
  const authCloseBtns = authModal.querySelectorAll('.modal-close');
  const formCloseBtns = greetingForm.querySelectorAll('.modal-close');
  
  const CORRECT_PASSWORD = 'pguti70'; 
  
  let greetings = JSON.parse(localStorage.getItem('customGreetings')) || [];
  
  function renderSavedGreetings() {
    greetings.forEach(greeting => {
      const newCard = createGreetingCard(greeting);
      cardsList.insertBefore(newCard, templateEl);
    });
  }
  
  function createGreetingCard(greeting) {
    const li = document.createElement('li');
    
    const formattedMessage = greeting.message.replace(/\n/g, '<br>');
    
    const companyText = greeting.company ? `АО «${greeting.company}»` : '';
    
    li.innerHTML = `
      <article class="card card_theme_dark">
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
    
    return li;
  }
  
  function openAuthModal() {
    authModal.style.display = 'flex';
    passwordInput.value = '';
    authError.textContent = '';
    passwordInput.focus();
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
      closeAuthModal();
      openGreetingForm();
    } else {
      authError.textContent = 'Неверный пароль. Обратитесь к администрации вуза.';
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
    
    const newCard = createGreetingCard(newGreeting);
    cardsList.insertBefore(newCard, templateEl);
    
    closeGreetingForm();
    
    showNotification('Поздравление успешно добавлено!');
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
  
  addGreetingBtn.addEventListener('click', openAuthModal);
  authSubmit.addEventListener('click', authenticate);
  passwordInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') authenticate();
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
  
  renderSavedGreetings();
});