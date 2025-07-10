document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      if (data.message?.includes('User not found')) {
        if (confirm('User not found. Would you like to register?')) {
          window.location.href = '/register.html';
        }
      } else {
        alert(data.message || 'Login failed');
      }
      return;
    }

    localStorage.setItem('token', data.access_token);
    window.location.href = '/dashboard.html';
  } catch (err) {
    console.error('Login error:', err);
    alert('Something went wrong. Please try again.');
  }
});
