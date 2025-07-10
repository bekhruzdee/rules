document
  .getElementById('registerForm')
  .addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
      const res = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.message || 'Registration failed');
        return;
      }

      alert('Registration successful! Please login.');
      window.location.href = '/login.html';
    } catch (err) {
      alert('Error registering user');
    }
  });
