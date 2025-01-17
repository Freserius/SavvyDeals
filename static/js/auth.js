// auth.js
document.addEventListener('DOMContentLoaded', () => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
  
    if (!isAuthenticated || isAuthenticated !== 'true') {
      alert('У вас нет доступа к этой странице. Авторизуйтесь, чтобы продолжить.');
      window.location.href = 'login.html'; // Перенаправляем на страницу авторизации
    }
  });
  