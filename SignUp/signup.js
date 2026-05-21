document.addEventListener('DOMContentLoaded', () => {
    // Handle password toggles
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const wrapper = btn.closest('.password-wrapper');
            const input = wrapper.querySelector('input');
            const eyeIcon = btn.querySelector('.eye-icon');
            const eyeOffIcon = btn.querySelector('.eye-off-icon');

            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);

            eyeIcon.classList.toggle('hidden');
            eyeOffIcon.classList.toggle('hidden');
        });
    });

    // Form Submission
    const signupForm = document.getElementById('signup-form');
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            alert("Passwords don't match!");
            return;
        }

        const submitBtn = signupForm.querySelector('.btn-primary');
        const originalText = submitBtn.textContent;

        submitBtn.innerHTML = `<span style="display:inline-block; animation: pulse 1s infinite;">Creating account...</span>`;
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.8';

        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            alert('Account created successfully for IdentityStores!');
            window.location.href = 'index.html'; // Redirect to login
        }, 1500);
    });

    // Google Sign-In Redirect
    const googleBtn = document.querySelector('.btn-google');
    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            window.location.href = 'https://accounts.google.com/AccountChooser?continue=' + encodeURIComponent(window.location.href);
        });
    }
});

// Add dynamic CSS for pulse animation if not exists
if (!document.querySelector('#pulse-animation')) {
    const style = document.createElement('style');
    style.id = 'pulse-animation';
    style.textContent = `
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}
