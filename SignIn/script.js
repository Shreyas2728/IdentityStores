document.addEventListener('DOMContentLoaded', () => {
    // View switching
    const loginView = document.getElementById('login-view');
    const forgotPasswordView = document.getElementById('forgot-password-view');
    const createAccountView = document.getElementById('create-account-view');

    const forgotPasswordLink = document.getElementById('forgot-password-link');
    const backToLoginLink = document.getElementById('back-to-login');
    const createAccountLink = document.getElementById('create-account-link');
    const caBackToLoginLink = document.getElementById('ca-back-to-login');

    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginView.classList.add('hidden');
        forgotPasswordView.classList.remove('hidden');
    });

    backToLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        forgotPasswordView.classList.add('hidden');
        loginView.classList.remove('hidden');
    });

    createAccountLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginView.classList.add('hidden');
        createAccountView.classList.remove('hidden');
    });

    caBackToLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        createAccountView.classList.add('hidden');
        loginView.classList.remove('hidden');
    });

    // Handle all password toggles
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

    // Form Submissions
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        simulateSubmit(loginForm, 'Logging in...', 'Login successful!');
    });

    const forgotPasswordForm = document.getElementById('forgot-password-form');
    forgotPasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Basic validation
        const fpPassword = document.getElementById('fp-password').value;
        const fpConfirmPassword = document.getElementById('fp-confirm-password').value;

        if (fpPassword !== fpConfirmPassword) {
            alert("Passwords don't match!");
            return;
        }

        simulateSubmit(forgotPasswordForm, 'Submitting...', 'Password reset successful!');
    });

    const createAccountForm = document.getElementById('create-account-form');
    createAccountForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Basic validation
        const caPassword = document.getElementById('ca-password').value;
        const caConfirmPassword = document.getElementById('ca-confirm-password').value;

        if (caPassword !== caConfirmPassword) {
            alert("Passwords don't match!");
            return;
        }

        simulateSubmit(createAccountForm, 'Creating account...', 'Account created successfully!');
    });

    function simulateSubmit(form, loadingText, successMsg) {
        const submitBtn = form.querySelector('.btn-primary');
        const originalText = submitBtn.textContent;

        submitBtn.innerHTML = `<span style="display:inline-block; animation: pulse 1s infinite;">${loadingText}</span>`;
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.8';

        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            alert(successMsg);

            if (form.id === 'forgot-password-form') {
                forgotPasswordView.classList.add('hidden');
                loginView.classList.remove('hidden');
                form.reset();
            } else if (form.id === 'create-account-form') {
                createAccountView.classList.add('hidden');
                loginView.classList.remove('hidden');
                form.reset();
            }
        }, 1500);
    }

    // Google Sign-In Redirect
    const googleBtn = document.querySelector('.btn-google');
    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            window.location.href = 'https://accounts.google.com/AccountChooser?continue=' + encodeURIComponent(window.location.href);
        });
    }
});

// Add dynamic CSS for pulse animation
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.5; }
        100% { opacity: 1; }
    }
`;
document.head.appendChild(style);