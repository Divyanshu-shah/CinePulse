// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get the booking form
    const bookingForm = document.getElementById('bookingForm');
    
    // Add submit event listener
    bookingForm.addEventListener('submit', function(event) {
        event.preventDefault(); // prevent page reload
        
        // Simple validation
        const name = document.getElementById('first-name').value;
        const mobile = document.getElementById('mobile').value;
        const tickets = document.getElementById('tickets').value;
        const date = document.getElementById('date').value;
        
        if (validateForm(name, mobile, tickets, date)) {
            alert("🎟️ Your ticket has been booked successfully!");
            bookingForm.reset(); // reset form fields
        }
    });
    
    // Form validation function
    function validateForm(name, mobile, tickets, date) {
        if (!name || !mobile || !tickets || !date) {
            alert("Please fill in all required fields!");
            return false;
        }
        
        // Mobile number validation (10 digits)
        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(mobile)) {
            alert("Please enter a valid 10-digit mobile number!");
            return false;
        }
        
        // Date validation (simple format check)
        const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!dateRegex.test(date)) {
            alert("Please enter date in dd/mm/yyyy format!");
            return false;
        }
        
        return true;
    }
});
