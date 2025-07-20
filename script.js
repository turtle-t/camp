document.getElementById('downloadBtn').addEventListener('click', function() {
    // Redirect to download link
    window.open('https://google.com', '_blank');
    
    // Show the hidden form
    document.getElementById('rewardForm').style.display = 'block';
    document.getElementById('rewardForm').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('claimForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Reset errors
    document.querySelectorAll('.error').forEach(el => el.style.display = 'none');
    
    // Validate inputs
    let isValid = true;
    const phone = document.getElementById('phone').value;
    if (!/^\d{10}$/.test(phone)) {
        document.getElementById('phoneError').style.display = 'block';
        isValid = false;
    }
    
    const upi = document.getElementById('upi').value;
    if (!upi.includes('@')) {
        document.getElementById('upiError').style.display = 'block';
        isValid = false;
    }
    
    const screenshot = document.getElementById('screenshot').files[0];
    if (!screenshot || !screenshot.type.startsWith('image/')) {
        document.getElementById('screenshotError').style.display = 'block';
        isValid = false;
    }
    
    if (isValid) {
        const submitBtn = document.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        try {
            // Send data to Netlify function
            const response = await fetch('/.netlify/functions/telegram', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone: phone,
                    upi: upi,
                    screenshotName: screenshot.name
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                document.getElementById('rewardForm').style.display = 'none';
                document.getElementById('successMessage').style.display = 'block';
                document.getElementById('successMessage').scrollIntoView({ behavior: 'smooth' });
            } else {
                alert('Submission failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Claim';
        }
    }
});