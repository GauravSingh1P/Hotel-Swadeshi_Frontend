document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signupForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const togglePassword = document.getElementById('togglePassword');
    const strengthBar = document.getElementById('strengthBar');
    const submitBtn = document.getElementById('submitBtn');
    const googleSignUp = document.getElementById('googleSignUp');
    
    // Password requirements elements
    const lengthReq = document.getElementById('lengthReq');
    const specialReq = document.getElementById('specialReq');
    const numberReq = document.getElementById('numberReq');
    const upperReq = document.getElementById('upperReq');

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

    // Password validation
    function validatePassword(password) {
        const checks = {
            length: password.length >= 8,
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
            number: /\d/.test(password),
            upper: /[A-Z]/.test(password)
        };
        
        // Update requirement indicators
        lengthReq.classList.toggle('valid', checks.length);
        specialReq.classList.toggle('valid', checks.special);
        numberReq.classList.toggle('valid', checks.number);
        upperReq.classList.toggle('valid', checks.upper);
        
        // Calculate strength
        const score = Object.values(checks).filter(Boolean).length;
        
        strengthBar.className = 'strength-bar';
        if (score === 1) strengthBar.classList.add('weak');
        else if (score === 2) strengthBar.classList.add('fair');
        else if (score === 3) strengthBar.classList.add('good');
        else if (score === 4) strengthBar.classList.add('strong');
        
        return checks;
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
        // Save email to localStorage for verification page
        localStorage.setItem('userEmail', emailInput.value.trim());
        
        if (emailInput.classList.contains('error')) {
            if (validateEmail(emailInput.value.trim())) {
                emailInput.classList.remove('error');
                emailInput.classList.add('success');
                emailError.textContent = '';
            }
        }
    });

    // Real-time password validation
    passwordInput.addEventListener('input', function() {
        const checks = validatePassword(passwordInput.value);
        const allValid = Object.values(checks).every(Boolean);
        
        if (passwordInput.value) {
            if (allValid) {
                passwordInput.classList.remove('error');
                passwordInput.classList.add('success');
                passwordError.textContent = '';
            } else {
                passwordInput.classList.add('error');
                passwordInput.classList.remove('success');
            }
        } else {
            passwordInput.classList.remove('error', 'success');
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
        
        const checks = validatePassword(password);
        if (!Object.values(checks).every(Boolean)) {
            passwordInput.classList.add('error');
            passwordError.textContent = 'Password does not meet all requirements';
            return;
        }
        
        // Save email to localStorage
        localStorage.setItem('userEmail', email);
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        try {
            // Mock backend response for static frontend
            const response = { status: 200 };
            const data = { message: 'Success' };
            
            // Artificial delay to simulate network request
            await new Promise(resolve => setTimeout(resolve, 800));
            
            if (response.status === 200) {
                showToast('Account created successfully! Redirecting...', 'success');
              
                setTimeout(() => {
                    window.location.href = 'verify.html';
                }, 1500);
            } else if (response.status === 400) {
                showToast(data.message || 'Invalid request. Please check your input.', 'error');
            } else if (response.status === 409) {
                showToast(data.message || 'An account with this email already exists.', 'error');
            } else if (response.status === 422) {
                showToast(data.message || 'Validation failed. Please check your input.', 'error');
            } else if (response.status === 500) {
                showToast(data.message || 'Server error. Please try again later.', 'error');
            } else {
                showToast(data.message || 'Something went wrong. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Signup error:', error);
            showToast('Unable to connect to server. Please check your connection.', 'error');
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });

    // Google Sign Up
    googleSignUp.addEventListener('click', function() {
        showToast('Account created with Google! Redirecting...', 'success');
        setTimeout(() => window.location.href = 'verify.html', 1500);
    });
});
