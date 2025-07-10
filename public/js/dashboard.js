// dashboard.js

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');

  // ❌ Token bo'lmasa, login sahifasiga qaytaramiz
  if (!token) {
    window.location.href = '/login.html';
    return;
  }

  // ✅ Logout tugmasi
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = '/login.html';
  });

  // ✅ Username ni chiqarish
  const username = localStorage.getItem('username');
  if (username) {
    document.getElementById('welcomeMessage').innerText = `Welcome, ${username}!`;
    document.getElementById('usernameDisplay').innerText = `@${username}`;
  }
});
