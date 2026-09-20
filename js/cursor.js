/* ═════════════════════════════════════════
   Custom Cursor — cursor.js
═════════════════════════════════════════ */
(function() {
  const dot = document.querySelector('.cursor-dot');
  const outline = document.querySelector('.cursor-outline');
  let mouseX = 0, mouseY = 0;
  let outX = 0, outY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  function animateOutline() {
    outX += (mouseX - outX) * .12;
    outY += (mouseY - outY) * .12;
    outline.style.left = outX + 'px';
    outline.style.top  = outY + 'px';
    requestAnimationFrame(animateOutline);
  }
  animateOutline();

  // Hover state
  const hoverEls = document.querySelectorAll(
    'a, button, .sport-card, .pricing-card, .bento-card, .gallery-item, .court-block, .time-slot, .cal-day, label, select, input, textarea, .sport-opt, .addon-item, .pay-method'
  );
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('hovered');
      outline.classList.add('hovered');
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('hovered');
      outline.classList.remove('hovered');
    });
  });

  // Magnetic effect on .magnetic elements
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * .2;
      const dy = (e.clientY - cy) * .2;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
})();
