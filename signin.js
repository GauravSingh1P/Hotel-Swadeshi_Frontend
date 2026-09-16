document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signinForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const togglePassword = document.getElementById('togglePassword');
    const submitBtn = document.getElementById('submitBtn');
    const googleSignIn = document.getElementById('googleSignIn');

    // Toggle password visibility
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
    });

    // Email validation
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Real-time email validation
    emailInput.addEventListener('blur', function() {
        const email = emailInput.value.trim();
        if (email && !validateEmail(email)) {
            emailInput.classList.add('error');
            emailInput.classList.remove('success');
            emailError.textContent = 'Please enter a valid email address';
        } else if (email) {
            emailInput.classList.remove('error');
            emailInput.classList.add('success');
            emailError.textContent = '';
        }
    });

    emailInput.addEventListener('input', function() {
        if (emailInput.classList.contains('error')) {
            if (validateEmail(emailInput.value.trim())) {
                emailInput.classList.remove('error');
                emailInput.classList.add('success');
                emailError.textContent = '';
            }
        }
    });

    // Password validation on blur
    passwordInput.addEventListener('blur', function() {
        if (!passwordInput.value) {
            passwordInput.classList.add('error');
            passwordError.textContent = 'Password is required';
        } else {
            passwordInput.classList.remove('error');
            passwordError.textContent = '';
        }
    });

    passwordInput.addEventListener('input', function() {
        if (passwordInput.classList.contains('error') && passwordInput.value) {
            passwordInput.classList.remove('error');
            passwordError.textContent = '';
        }
    });

    // Show toast notification
    function showToast(message, type = 'error') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        
        toastMessage.textContent = message;
        toast.className = 'toast show ' + type;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        
        // Reset errors
        emailError.textContent = '';
        passwordError.textContent = '';
        emailInput.classList.remove('error');
        passwordInput.classList.remove('error');
        
        // Validate email
        if (!email) {
            emailInput.classList.add('error');
            emailError.textContent = 'Email is required';
            return;
        }
        
        if (!validateEmail(email)) {
            emailInput.classList.add('error');
            emailError.textContent = 'Please enter a valid email address';
            return;
        }
        
        // Validate password
        if (!password) {
            passwordInput.classList.add('error');
            passwordError.textContent = 'Password is required';
            return;
        }
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;


        
        
        try {
            // Mock backend response for static frontend
            const response = { status: 200 };
            const data = { token: 'mock-jwt-token', message: 'Success' };
            
            // Artificial delay to simulate network request
            await new Promise(resolve => setTimeout(resolve, 800));
            
            if (response.status === 200) {
                showToast('Sign in successful! Redirecting...', 'success');
                // Store user info if needed
                if (data.token) {
                    localStorage.setItem('authToken', data.token);
                }
                setTimeout(() => {
                    window.location.href = 'home.html';
                }, 1500);
            } else if (response.status === 400) {
                showToast(data.message || 'Invalid request. Please check your input.', 'error');
            } else if (response.status === 401) {
                showToast(data.message || 'Invalid email or password.', 'error');
            } else if (response.status === 403) {
                showToast(data.message || 'Account not verified. Please check your email.', 'error');
            } else if (response.status === 404) {
                showToast(data.message || 'Account not found. Please sign up first.', 'error');
            } else if (response.status === 429) {
                showToast(data.message || 'Too many attempts. Please try again later.', 'error');
            } else if (response.status === 500) {
                showToast(data.message || 'Server error. Please try again later.', 'error');
            } else {
                showToast(data.message || 'Something went wrong. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Signin error:', error);
            showToast('Unable to connect to server. Please check your connection.', 'error');
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });

    // Google Sign In
    googleSignIn.addEventListener('click', function() {
        showToast('Google Sign In successful! Redirecting...', 'success');
        setTimeout(() => window.location.href = 'home.html', 1500);
    });
});
