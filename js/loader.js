/* loader.js — Page loader with grass animation */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');

  // Animate loader-text letters with stagger
  const letters = loader.querySelectorAll('.loader-text span');
  letters.forEach((l, i) => {
    l.style.animationDelay = (i * 0.06) + 's';
  });

  setTimeout(() => {
    loader.classList.add('fade-out');
    setTimeout(() => {
      loader.style.display = 'none';
      // Trigger hero entrance animations
      document.querySelectorAll('.hero-content > *').forEach(el => {
        el.style.animationPlayState = 'running';
      });
    }, 800);
  }, 2000);
});
