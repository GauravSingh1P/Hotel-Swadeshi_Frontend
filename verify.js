document.addEventListener('DOMContentLoaded', function() {
    const otpInputs = document.querySelectorAll('.otp-input');
    const verifyBtn = document.getElementById('verifyBtn');
    const resendBtn = document.getElementById('resendBtn');
    const timerDisplay = document.getElementById('timer');
    const otpError = document.getElementById('otpError');
    const emailDisplay = document.getElementById('emailDisplay');
    const verifyForm = document.getElementById('verifyForm');
    
    let resendTimer = null;
    let firstResendClicked = false;

    // Display email from localStorage
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
        emailDisplay.textContent = userEmail;
    } else {
        emailDisplay.textContent = 'your email';
    }

    // OTP Input handling
    otpInputs.forEach((input, index) => {
        // Only allow numbers
        input.addEventListener('input', function(e) {
            const value = e.target.value;
            
            // Only keep numbers
            if (!/^\d*$/.test(value)) {
                e.target.value = value.replace(/\D/g, '');
                return;
            }
            
            // Handle paste of multiple digits
            if (value.length > 1) {
                const digits = value.split('');
                digits.forEach((digit, i) => {
                    if (otpInputs[index + i]) {
                        otpInputs[index + i].value = digit;
                        otpInputs[index + i].classList.add('filled');
                    }
                });
                const nextIndex = Math.min(index + digits.length, otpInputs.length - 1);
                otpInputs[nextIndex].focus();
                return;
            }
            
            if (value) {
                input.classList.add('filled');
                input.classList.remove('error');
                // Move to next input
                if (index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                }
            } else {
                input.classList.remove('filled');
            }
            
            // Clear error when typing
            otpError.textContent = '';
            otpInputs.forEach(inp => inp.classList.remove('error'));
        });

        // Handle backspace
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && !input.value && index > 0) {
                otpInputs[index - 1].focus();
                otpInputs[index - 1].value = '';
                otpInputs[index - 1].classList.remove('filled');
            }
            
            // Allow arrow key navigation
            if (e.key === 'ArrowLeft' && index > 0) {
                e.preventDefault();
                otpInputs[index - 1].focus();
            }
            if (e.key === 'ArrowRight' && index < otpInputs.length - 1) {
                e.preventDefault();
                otpInputs[index + 1].focus();
            }
        });

        // Handle paste
        input.addEventListener('paste', function(e) {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
            
            if (pastedData) {
                pastedData.split('').forEach((digit, i) => {
                    if (otpInputs[i]) {
                        otpInputs[i].value = digit;
                        otpInputs[i].classList.add('filled');
                    }
                });
                
                const focusIndex = Math.min(pastedData.length, otpInputs.length - 1);
                otpInputs[focusIndex].focus();
            }
        });

        // Focus handling
        input.addEventListener('focus', function() {
            input.select();
        });
    });

    // Get OTP value
    function getOTPValue() {
        return Array.from(otpInputs).map(input => input.value).join('');
    }

    // Check if OTP is complete
    function isOTPComplete() {
        return getOTPValue().length === 6;
    }

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

    // Start countdown timer
    function startTimer(duration) {
        let timeLeft = duration;
        resendBtn.disabled = true;
        
        timerDisplay.textContent = `Resend available in ${timeLeft}s`;
        
        resendTimer = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = `Resend available in ${timeLeft}s`;
            
            if (timeLeft <= 0) {
                clearInterval(resendTimer);
                resendBtn.disabled = false;
                timerDisplay.textContent = '';
            }
        }, 1000);
    }

    // Form submission
    verifyForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!isOTPComplete()) {
            otpError.textContent = 'Please enter all 6 digits of the verification code';
            otpInputs.forEach(input => {
                if (!input.value) {
                    input.classList.add('error');
                }
            });
            return;
        }
        
        const otp = getOTPValue();
        const email = localStorage.getItem('userEmail');
        const token = localStorage.getItem('verifcation_token');
        
        verifyBtn.classList.add('loading');
        verifyBtn.disabled = true;
        
        try {
            // Mock backend response for static frontend
            const response = { status: 200 };
            const data = { token: 'mock-jwt-token', message: 'Success' };
            
            // Artificial delay to simulate network request
            await new Promise(resolve => setTimeout(resolve, 800));
            
            if (response.status === 200) {
                showToast('Email verified successfully! Redirecting...', 'success');
                if (data.token) {
                    localStorage.setItem('token', data.token);
                }

                setTimeout(() => {
                    window.location.href = 'home.html';
                }, 1500);
            } else if (response.status === 400) {
                showToast(data.message || 'Invalid verification code. Please try again.', 'error');
                otpInputs.forEach(input => input.classList.add('error'));
            } else if (response.status === 410) {
                showToast(data.message || 'Verification code expired. Please request a new one.', 'error');
            } else {
                showToast(data.message || 'Something went wrong. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Verification error:', error);
            showToast('Unable to connect to server. Please check your connection.', 'error');
        } finally {
            verifyBtn.classList.remove('loading');
            verifyBtn.disabled = false;
        }
    });

    // Resend OTP
    resendBtn.addEventListener('click', async function() {
        const email = localStorage.getItem('userEmail');
        
        if (!email) {
            showToast('Email not found. Please sign up again.', 'error');
            return;
        }
        
        // Clear existing OTP
        otpInputs.forEach(input => {
            input.value = '';
            input.classList.remove('filled', 'error');
        });
        otpInputs[0].focus();
        otpError.textContent = '';
        
        try {
            // Mock backend response for static frontend
            const response = { status: 200 };
            const data = { message: 'Success' };
            
            // Artificial delay to simulate network request
            await new Promise(resolve => setTimeout(resolve, 800));
            
            if (response.status === 200) {
                showToast('Verification code resent successfully!', 'success');
            } else {
                showToast(data.message || 'Failed to resend code. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Resend error:', error);
            showToast('Unable to connect to server. Please check your connection.', 'error');
        }
        
        // Start timer after first resend click
        if (firstResendClicked) {
            startTimer(60);
        } else {
            firstResendClicked = true;
            showToast('Code resent! Timer will start on next resend.', 'success');
        }
    });

    // Focus first input on load
    otpInputs[0].focus();
});
