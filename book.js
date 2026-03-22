/* ============================================
   CinePulse — Booking Form Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  const ticketsInput = document.getElementById('tickets');
  const dateInput = document.getElementById('date');
  const seatRadios = document.querySelectorAll('input[name="seat"]');

  const summaryTickets = document.getElementById('summaryTickets');
  const summarySeat = document.getElementById('summarySeat');
  const summaryDate = document.getElementById('summaryDate');
  const summaryTotal = document.getElementById('summaryTotal');

  const seatPrices = {
    Silver: 500,
    Gold: 1000,
    Diamond: 1500
  };

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
  seatRadios.forEach(r => r.addEventListener('change', updateSummary));

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

      showToast(`🎟️ Booking confirmed! ${tickets} ${seat.value} ticket(s) — ₹${total.toLocaleString('en-IN')}`, 'success');

      btnText.style.display = 'inline';
      btnLoading.style.display = 'none';
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';

      form.reset();
      updateSummary();
    }, 1500);
  });
});
