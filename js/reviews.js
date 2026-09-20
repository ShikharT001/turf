/* ═════════════════════════════════════════
   reviews.js — Reviews slider and submission
═════════════════════════════════════════ */

const reviewsData = [
  { name: 'Arjun Sharma', sport: 'Football', rating: 5, text: 'Absolutely world-class facility! The turf quality is incredible — it feels like playing on a professional pitch. The booking system is seamless and confirmation was instant.', avatar: 'A', color: '#22c55e', date: '2 days ago' },
  { name: 'Priya Menon', sport: 'Multi-Sport', rating: 5, text: 'Brought my badminton team here for the first time and we were blown away. Premium changing rooms, great lighting for evening sessions, and very friendly staff.', avatar: 'P', color: '#4ade80', date: '1 week ago' },
  { name: 'Rahul Verma', sport: 'Cricket', rating: 5, text: 'The cricket nets are top-notch. Pitch surface mimics real grass conditions beautifully. Will definitely be a regular here for practice sessions.', avatar: 'R', color: '#84cc16', date: '2 weeks ago' },
  { name: 'Sneha Patel', sport: 'Training', rating: 5, text: 'Hired a personal coach through GreenField and the experience was beyond expectations. The facility is impeccably maintained and the staff is very professional.', avatar: 'S', color: '#a3e635', date: '3 weeks ago' },
  { name: 'Karthik Iyer', sport: 'Football', rating: 4, text: 'Great turf, excellent floodlights. Parking is a bit tricky during peak hours but overall the experience is premium. Highly recommend booking the early morning slots!', avatar: 'K', color: '#f59e0b', date: '1 month ago' },
  { name: 'Deepika Nair', sport: 'Multi-Sport', rating: 5, text: 'Came here for a corporate team event and GreenField exceeded all expectations. The event coordination team was exceptional. Everyone had a fantastic time!', avatar: 'D', color: '#f97316', date: '1 month ago' },
  { name: 'Vikram Singh', sport: 'Football', rating: 5, text: 'Best turf in the city, bar none. We\'ve tried 5 different facilities and GreenField stands out on every metric — surface quality, amenities, and value.', avatar: 'V', color: '#06b6d4', date: '5 weeks ago' },
  { name: 'Anjali Reddy', sport: 'Cricket', rating: 5, text: 'Booked 3 times already and each visit is consistently excellent. The turf is always fresh and the cafeteria serves really good post-game refreshments!', avatar: 'A', color: '#8b5cf6', date: '6 weeks ago' },
  { name: 'Mohammed Ali', sport: 'Training', rating: 5, text: 'The coaching sessions here transformed my game. Professional trainers with a great eye for technique. The indoor training zone is a massive advantage during monsoon!', avatar: 'M', color: '#ec4899', date: '2 months ago' }
];

let currentReview = 0;
const perPage = 3;

function renderReviews() {
  const track = document.getElementById('reviewsTrack');
  const dotsContainer = document.getElementById('revDots');
  track.innerHTML = '';

  reviewsData.forEach(review => {
    const stars = Array.from({ length: 5 }, (_, i) =>
      `<i class="${i < review.rating ? 'fas' : 'far'} fa-star"></i>`
    ).join('');

    const card = document.createElement('div');
    card.className = 'review-card reveal-up';
    card.innerHTML = `
      <div class="review-header">
        <div class="review-avatar" style="background:${review.color}">${review.avatar}</div>
        <div class="review-info">
          <h4>${review.name}</h4>
          <span>${review.date}</span>
        </div>
        <div class="review-stars" style="margin-left:auto">${stars}</div>
      </div>
      <p class="review-text">"${review.text}"</p>
      <span class="review-tag">${review.sport}</span>
    `;
    track.appendChild(card);
  });

  // Dots
  const totalPages = Math.ceil(reviewsData.length / perPage);
  dotsContainer.innerHTML = '';
  for (let i = 0; i < totalPages; i++) {
    const dot = document.createElement('div');
    dot.className = 'rev-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToPage(i));
    dotsContainer.appendChild(dot);
  }

  updateSlider();
}

function goToPage(page) {
  const totalPages = Math.ceil(reviewsData.length / perPage);
  currentReview = Math.max(0, Math.min(page, totalPages - 1));
  updateSlider();
}

function updateSlider() {
  const track = document.getElementById('reviewsTrack');
  const cardWidth = track.querySelector('.review-card')?.offsetWidth + 24 || 0;
  track.style.transform = `translateX(-${currentReview * cardWidth * perPage}px)`;

  document.querySelectorAll('.rev-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentReview);
  });
}

// Navigation
document.addEventListener('DOMContentLoaded', () => {
  renderReviews();

  document.getElementById('revNext').addEventListener('click', () => {
    const totalPages = Math.ceil(reviewsData.length / perPage);
    goToPage((currentReview + 1) % totalPages);
  });

  document.getElementById('revPrev').addEventListener('click', () => {
    const totalPages = Math.ceil(reviewsData.length / perPage);
    goToPage((currentReview - 1 + totalPages) % totalPages);
  });

  // Auto-slide
  setInterval(() => {
    const totalPages = Math.ceil(reviewsData.length / perPage);
    goToPage((currentReview + 1) % totalPages);
  }, 5000);

  // Star rating
  let selectedRating = 0;
  const stars = document.querySelectorAll('#starRating i');
  stars.forEach(star => {
    star.addEventListener('mouseenter', () => {
      const val = parseInt(star.dataset.val);
      stars.forEach((s, i) => {
        s.className = i < val ? 'fas fa-star active' : 'far fa-star';
      });
    });
    star.addEventListener('mouseleave', () => {
      stars.forEach((s, i) => {
        s.className = i < selectedRating ? 'fas fa-star active' : 'far fa-star';
      });
    });
    star.addEventListener('click', () => {
      selectedRating = parseInt(star.dataset.val);
      stars.forEach((s, i) => {
        s.className = i < selectedRating ? 'fas fa-star active' : 'far fa-star';
      });
    });
  });

  // Submit review
  document.getElementById('submitReview').addEventListener('click', () => {
    const name = document.getElementById('reviewName').value.trim();
    const text = document.getElementById('reviewText').value.trim();
    const sport = document.getElementById('reviewSport').value;

    if (!name) { showToast('⚠️ Please enter your name', 'warning'); return; }
    if (!text) { showToast('⚠️ Please write a review', 'warning'); return; }
    if (!selectedRating) { showToast('⚠️ Please select a rating', 'warning'); return; }

    const colors = ['#22c55e','#4ade80','#84cc16','#f59e0b','#f97316','#06b6d4','#8b5cf6'];
    reviewsData.unshift({
      name,
      sport,
      rating: selectedRating,
      text,
      avatar: name.charAt(0).toUpperCase(),
      color: colors[Math.floor(Math.random() * colors.length)],
      date: 'Just now'
    });

    document.getElementById('reviewName').value = '';
    document.getElementById('reviewText').value = '';
    selectedRating = 0;
    stars.forEach(s => s.className = 'far fa-star');

    renderReviews();
    currentReview = 0;
    updateSlider();

    showToast('🎉 Thank you for your review!', 'success');
  });

  window.addEventListener('resize', updateSlider);
});
