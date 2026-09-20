/* ═════════════════════════════════════════
   booking.js — Full booking system logic
═════════════════════════════════════════ */

const Booking = {
  state: {
    sport: null,
    court: null,
    date: null,
    time: null,
    step: 1
  },

  // ── Step navigation ──────────────────────────────────
  goTo(step) {
    document.querySelectorAll('.booking-panel').forEach(p => p.classList.remove('active'));
    document.getElementById(`step${step}`).classList.add('active');
    this.state.step = step;
    this.updateStepUI(step);
    window.scrollTo({ top: document.getElementById('booking').offsetTop - 80, behavior: 'smooth' });
  },

  updateStepUI(step) {
    document.querySelectorAll('.step').forEach((el, i) => {
      const num = i + 1;
      el.classList.remove('active', 'completed');
      if (num === step) el.classList.add('active');
      if (num < step) el.classList.add('completed');
    });
    document.querySelectorAll('.step-connector').forEach((el, i) => {
      el.classList.toggle('active', i + 1 < step);
    });
  },

  // ── Calendar ─────────────────────────────────────────
  currentDate: new Date(),
  selectedDate: null,

  renderCalendar() {
    const d = this.currentDate;
    const year = d.getFullYear();
    const month = d.getMonth();
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    document.getElementById('calMonthYear').textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    const grid = document.getElementById('calDays');
    grid.innerHTML = '';

    // Empty cells
    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('div');
      empty.className = 'cal-day empty';
      grid.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayEl = document.createElement('div');
      dayEl.className = 'cal-day';
      dayEl.textContent = day;

      const thisDate = new Date(year, month, day);
      const isPast = thisDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const isToday = thisDate.toDateString() === today.toDateString();
      const isSelected = this.selectedDate && thisDate.toDateString() === this.selectedDate.toDateString();

      if (isPast) dayEl.classList.add('past');
      if (isToday) dayEl.classList.add('today');
      if (isSelected) dayEl.classList.add('selected');

      if (!isPast) {
        dayEl.addEventListener('click', () => {
          this.selectedDate = new Date(year, month, day);
          this.state.date = this.selectedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
          this.renderCalendar();
          showToast(`📅 Date selected: ${this.state.date}`);
        });
      }
      grid.appendChild(dayEl);
    }
  },

  // ── Initialize ─────────────────────────────────────────
  init() {
    this.renderCalendar();

    // Calendar navigation
    document.getElementById('prevMonth').addEventListener('click', () => {
      const d = this.currentDate;
      this.currentDate = new Date(d.getFullYear(), d.getMonth() - 1, 1);
      this.renderCalendar();
    });
    document.getElementById('nextMonth').addEventListener('click', () => {
      const d = this.currentDate;
      this.currentDate = new Date(d.getFullYear(), d.getMonth() + 1, 1);
      this.renderCalendar();
    });

    // Step next/back
    document.querySelectorAll('.step-next').forEach(btn => {
      btn.addEventListener('click', () => {
        const next = parseInt(btn.dataset.next);
        if (next === 2 && !this.validateStep1()) return;
        if (next === 4) this.buildSummary();
        this.goTo(next);
      });
    });
    document.querySelectorAll('.step-back').forEach(btn => {
      btn.addEventListener('click', () => this.goTo(parseInt(btn.dataset.back)));
    });

    // Sport selection
    document.querySelectorAll('input[name="sport"]').forEach(radio => {
      radio.addEventListener('change', () => {
        this.state.sport = radio.value;
        document.getElementById('sum-sport').textContent = radio.value.charAt(0).toUpperCase() + radio.value.slice(1);
      });
    });

    // Court selection
    document.querySelectorAll('.court-block.available').forEach(block => {
      block.addEventListener('click', () => {
        document.querySelectorAll('.court-block').forEach(b => b.classList.remove('selected'));
        block.classList.add('selected');
        this.state.court = 'Court ' + block.dataset.court;
        document.getElementById('sum-court').textContent = this.state.court;
        showToast(`✅ ${this.state.court} selected`);
      });
    });

    // Time slots
    document.querySelectorAll('.time-slot.available').forEach(slot => {
      slot.addEventListener('click', () => {
        document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
        slot.classList.add('selected');
        this.state.time = slot.textContent;
        document.getElementById('sum-time').textContent = this.state.time;
        showToast(`🕐 Slot selected: ${this.state.time}`);
      });
    });

    // Confirm booking
    document.getElementById('confirmBooking').addEventListener('click', () => {
      this.confirmBooking();
    });
  },

  validateStep1() {
    if (!this.state.sport) { showToast('⚠️ Please select a sport', 'warning'); return false; }
    if (!this.state.court) { showToast('⚠️ Please select a court', 'warning'); return false; }
    return true;
  },

  buildSummary() {
    const dateEl = document.getElementById('sum-date');
    const timeEl = document.getElementById('sum-time');
    if (this.state.date) dateEl.textContent = this.state.date;
    if (this.state.time) timeEl.textContent = this.state.time;

    const dur = document.querySelector('.booking-form select:nth-of-type(2)');
    if (dur) document.getElementById('sum-duration').textContent = dur.value || '1 Hour';
    const pla = document.querySelector('.booking-form select:nth-of-type(1)');
    if (pla) document.getElementById('sum-players').textContent = pla.value || '2–5 Players';
  },

  confirmBooking() {
    const btn = document.getElementById('confirmBooking');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    btn.disabled = true;

    setTimeout(() => {
      // Generate booking ID
      const ref = 'GF-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 9000) + 1000);
      document.getElementById('bookingRef').textContent = ref;

      document.querySelectorAll('.booking-panel').forEach(p => p.classList.remove('active'));
      document.getElementById('stepSuccess').classList.add('active');
      this.updateStepUI(5);

      // Launch confetti
      this.launchConfetti();
      showToast('🎉 Booking confirmed! Check your email.', 'success');
    }, 2000);
  },

  launchConfetti() {
    const container = document.getElementById('confetti');
    if (!container) return;
    const colors = ['#22c55e', '#4ade80', '#84cc16', '#f59e0b', '#f97316', '#a3e635'];
    for (let i = 0; i < 40; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.cssText = `
        left: ${Math.random() * 100}%;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        width: ${Math.random() * 8 + 4}px;
        height: ${Math.random() * 8 + 4}px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        animation-delay: ${Math.random() * 0.5}s;
        animation-duration: ${Math.random() * 1 + 1}s;
      `;
      container.appendChild(piece);
    }
  }
};

function resetBooking() {
  Booking.state = { sport: null, court: null, date: null, time: null, step: 1 };
  Booking.selectedDate = null;
  document.querySelectorAll('input[name="sport"]').forEach(r => r.checked = false);
  document.querySelectorAll('.court-block').forEach(b => b.classList.remove('selected'));
  document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
  document.getElementById('confetti').innerHTML = '';
  Booking.goTo(1);
  Booking.renderCalendar();
}

// ── Toast utility ──────────────────────────────────────
function showToast(msg, type = 'default') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.style.background = type === 'warning' ? '#f59e0b' : type === 'success' ? '#22c55e' : '#1f2937';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

window.showToast = showToast;
window.resetBooking = resetBooking;

document.addEventListener('DOMContentLoaded', () => Booking.init());
