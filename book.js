/* ============================================
   CinePulse — Booking Form Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
  const params = new URLSearchParams(window.location.search);
  const itemType = params.get('type') || localStorage.getItem('bookingType');
  const itemName = params.get('name') || localStorage.getItem('bookingName');
  const itemGenre = params.get('genre') || localStorage.getItem('bookingGenre');
  const itemLang = params.get('lang') || localStorage.getItem('bookingLang');
  const itemImage = params.get('image') || localStorage.getItem('bookingImage');

  const bookingEmpty = document.getElementById('bookingEmpty');
  const bookingContent = document.getElementById('bookingContent');

  // If no item was selected, show the empty state
  if (!itemType || !itemName) {
    bookingEmpty.style.display = 'flex';
    bookingContent.style.display = 'none';
    return;
  }

  // Show the booking content
  bookingEmpty.style.display = 'none';
  bookingContent.style.display = 'block';

  // --- Populate banner ---
  const bannerImage = document.getElementById('bannerImage');
  const bannerName = document.getElementById('bannerName');
  const bannerType = document.getElementById('bannerType');
  const bannerGenre = document.getElementById('bannerGenre');
  const bannerLang = document.getElementById('bannerLang');

  if (bannerImage && itemImage) {
    bannerImage.src = itemImage;
    bannerImage.alt = itemName;
  }
  if (bannerName) bannerName.textContent = itemName;
  if (bannerType) {
    const typeLabel = itemType === 'event' ? '🎭 Event' : '🎬 Movie';
    bannerType.textContent = typeLabel;
    bannerType.className = 'booking-banner__type booking-banner__type--' + itemType;
  }
  if (bannerGenre && itemGenre) bannerGenre.textContent = itemGenre;
  if (bannerLang && itemLang) bannerLang.textContent = itemLang;

  // --- Update page title ---
  document.title = `Book ${itemName} — CinePulse`;

  // --- Update booking card header ---
  const bookingTitle = document.getElementById('bookingTitle');
  const bookingSubtitle = document.getElementById('bookingSubtitle');

  if (itemType === 'event') {
    if (bookingTitle) bookingTitle.textContent = 'Book Event Tickets';
    if (bookingSubtitle) bookingSubtitle.textContent = `Secure your spot for ${itemName}`;
  } else {
    if (bookingTitle) bookingTitle.textContent = 'Book Movie Tickets';
    if (bookingSubtitle) bookingSubtitle.textContent = `Get your seats for ${itemName}`;
  }

  // --- Seat type options based on type ---
  const seatOptions = document.getElementById('seatOptions');
  const seatSectionTitle = document.getElementById('seatSectionTitle');

  let seatConfig;

  if (itemType === 'event') {
    if (seatSectionTitle) seatSectionTitle.textContent = 'Select Pass Type';
    seatConfig = [
      { value: 'General', icon: '🎫', name: 'General', price: 500 },
      { value: 'VIP', icon: '⭐', name: 'VIP', price: 1500 },
      { value: 'VVIP', icon: '👑', name: 'VVIP', price: 3000 }
    ];
  } else {
    if (seatSectionTitle) seatSectionTitle.textContent = 'Select Seat Type';
    seatConfig = [
      { value: 'Silver', icon: '🪑', name: 'Silver', price: 500 },
      { value: 'Gold', icon: '⭐', name: 'Gold', price: 1000 },
      { value: 'Diamond', icon: '💎', name: 'Diamond', price: 1500 }
    ];
  }

  // Build seat options HTML
  if (seatOptions) {
    seatOptions.innerHTML = seatConfig.map(seat => `
      <label class="seat-card">
        <input type="radio" name="seat" value="${seat.value}" required>
        <div class="seat-card__content">
          <div class="seat-card__icon">${seat.icon}</div>
          <div class="seat-card__name">${seat.name}</div>
          <div class="seat-card__price">₹${seat.price.toLocaleString('en-IN')}</div>
        </div>
      </label>
    `).join('');
  }

  // Build seat price map
  const seatPrices = {};
  seatConfig.forEach(s => seatPrices[s.value] = s.price);

  // --- Summary: show item name ---
  const summaryItemLabel = document.getElementById('summaryItemLabel');
  const summaryItemName = document.getElementById('summaryItemName');
  if (summaryItemLabel) summaryItemLabel.textContent = itemType === 'event' ? 'Event' : 'Movie';
  if (summaryItemName) summaryItemName.textContent = itemName;

  // --- Tips based on type ---
  const tipsTitle = document.getElementById('tipsTitle');
  const tipsList = document.getElementById('tipsList');
  if (itemType === 'event') {
    if (tipsTitle) tipsTitle.textContent = '💡 Event Tips';
    if (tipsList) tipsList.innerHTML = `
      <li>Gates open 30 minutes before the event</li>
      <li>VVIP pass includes backstage access</li>
      <li>Free cancellation up to 24 hours before</li>
      <li>Carry your ID proof along with the ticket</li>
      <li>Food & beverages available at the venue</li>
    `;
  } else {
    if (tipsTitle) tipsTitle.textContent = '💡 Movie Tips';
    if (tipsList) tipsList.innerHTML = `
      <li>Arrive 15 minutes before showtime</li>
      <li>Diamond seats include complimentary snacks</li>
      <li>Free cancellation up to 2 hours before</li>
      <li>Show your booking confirmation at the counter</li>
    `;
  }

  // --- Form logic ---
  const form = document.getElementById('bookingForm');
  if (!form) return;

  const ticketsInput = document.getElementById('tickets');
  const dateInput = document.getElementById('date');
  const summaryTickets = document.getElementById('summaryTickets');
  const summarySeat = document.getElementById('summarySeat');
  const summaryDate = document.getElementById('summaryDate');
  const summaryTotal = document.getElementById('summaryTotal');

  // Set min date to today
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);

  // Live summary updates
  function updateSummary() {
    const tickets = parseInt(ticketsInput.value) || 0;
    const seat = document.querySelector('input[name="seat"]:checked');
    const date = dateInput.value;

    summaryTickets.textContent = tickets > 0 ? tickets : '—';

    if (seat) {
      summarySeat.textContent = seat.value;
    } else {
      summarySeat.textContent = '—';
    }

    if (date) {
      const d = new Date(date);
      summaryDate.textContent = d.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } else {
      summaryDate.textContent = '—';
    }

    if (tickets > 0 && seat) {
      const total = tickets * seatPrices[seat.value];
      summaryTotal.textContent = '₹' + total.toLocaleString('en-IN');
      summaryTotal.style.transform = 'scale(1.1)';
      setTimeout(() => summaryTotal.style.transform = 'scale(1)', 200);
    } else {
      summaryTotal.textContent = '₹0';
    }
  }

  ticketsInput.addEventListener('input', updateSummary);
  dateInput.addEventListener('input', updateSummary);

  // Attach listeners to dynamically created seat radios
  document.querySelectorAll('input[name="seat"]').forEach(r => r.addEventListener('change', updateSummary));

  // Form validation with inline errors
  function clearErrors() {
    document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
    document.querySelectorAll('.form-input.error').forEach(el => el.classList.remove('error'));
  }

  function setError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (input) input.classList.add('error');
    if (error) error.textContent = message;
  }

  // Submit handler
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();

    const name = document.getElementById('first-name').value.trim();
    const mobile = document.getElementById('mobile').value.trim();
    const tickets = document.getElementById('tickets').value;
    const date = dateInput.value;
    const seat = document.querySelector('input[name="seat"]:checked');
    const terms = document.getElementById('terms-and-conditions').checked;

    let valid = true;

    if (!name) {
      setError('first-name', 'nameError', 'Please enter your name');
      valid = false;
    }

    if (!mobile || !/^[0-9]{10}$/.test(mobile)) {
      setError('mobile', 'mobileError', 'Enter a valid 10-digit mobile number');
      valid = false;
    }

    if (!tickets || tickets < 1 || tickets > 10) {
      setError('tickets', 'ticketsError', 'Enter between 1 and 10 tickets');
      valid = false;
    }

    if (!date) {
      setError('date', 'dateError', 'Please select a date');
      valid = false;
    }

    if (!seat) {
      showToast('Please select a seat type', 'error');
      valid = false;
    }

    if (!terms) {
      showToast('Please accept the terms and conditions', 'error');
      valid = false;
    }

    if (!valid) return;

    // Simulate booking
    const submitBtn = form.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.submit-btn__text');
    const btnLoading = submitBtn.querySelector('.submit-btn__loading');

    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    setTimeout(() => {
      const total = parseInt(tickets) * seatPrices[seat.value];
      const typeLabel = itemType === 'event' ? 'event' : 'movie';

      showToast(`🎟️ Booking confirmed for ${itemName}! ${tickets} ${seat.value} ticket(s) — ₹${total.toLocaleString('en-IN')}`, 'success');

      btnText.style.display = 'inline';
      btnLoading.style.display = 'none';
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';

      form.reset();
      updateSummary();
    }, 1500);
  });
});
