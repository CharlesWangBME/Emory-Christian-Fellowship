// scripts/main.js

// This script controls the responsive navigation menu and basic interactive features.
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.getElementById('nav-menu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navMenu.classList.toggle('open');
  });
}

// Enhance form submission gracefully if JavaScript is available.
const joinForm = document.getElementById('joinForm');
if (joinForm) {
  joinForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(joinForm);
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
    };
    try {
      const res = await fetch(joinForm.action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        alert('Thank you for signing up!');
        joinForm.reset();
      } else {
        alert('There was an error submitting the form. Please try again later.');
      }
    } catch (err) {
      console.error(err);
      alert('An unexpected error occurred.');
    }
  });
}