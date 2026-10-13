function applyStoredTheme() {
  const savedTheme = localStorage.getItem('portalTheme') || 'light';
  const selectedTheme = savedTheme === 'dark' ? 'dark' : 'light';

  document.body.classList.remove('theme-dark', 'theme-light');
  document.body.classList.add(selectedTheme === 'dark' ? 'theme-dark' : 'theme-light');
}

window.addEventListener('DOMContentLoaded', applyStoredTheme);
window.addEventListener('storage', (event) => {
  if (event.key === 'portalTheme') {
    applyStoredTheme();
  }
});

applyStoredTheme();
