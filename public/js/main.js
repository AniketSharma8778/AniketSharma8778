const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('mainNav');
if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => nav.classList.toggle('open'));
}

const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('newsletterEmail').value.trim();
    const message = document.getElementById('newsletterMessage');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      message.textContent = data.message;
      message.style.color = response.ok ? '#84ffb5' : '#ff9f9f';
      if (response.ok) newsletterForm.reset();
    } catch (_error) {
      message.textContent = 'Something went wrong. Please try again.';
      message.style.color = '#ff9f9f';
    }
  });
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const messageNode = document.getElementById('contactMessage');
    const formData = new FormData(contactForm);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      messageNode.textContent = data.message;
      messageNode.style.color = response.ok ? '#84ffb5' : '#ff9f9f';
      if (response.ok) contactForm.reset();
    } catch (_error) {
      messageNode.textContent = 'Failed to submit inquiry. Try again in a moment.';
      messageNode.style.color = '#ff9f9f';
    }
  });
}
