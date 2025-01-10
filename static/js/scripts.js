function showMainPage() {
    document.getElementById('main-page').classList.remove('hidden');
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('register-page').classList.add('hidden');
    document.getElementById('forgot-password-page').classList.add('hidden');
}

function showLoginPage() {
    document.getElementById('main-page').classList.add('hidden');
    document.getElementById('login-page').classList.remove('hidden');
    document.getElementById('forgot-password-page').classList.add('hidden'); // Ensure forgot password page is hidden
}

function showRegisterPage() {
    document.getElementById('main-page').classList.add('hidden');
    document.getElementById('register-page').classList.remove('hidden');
}

function showForgotPasswordPage() {
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('forgot-password-page').classList.remove('hidden');
}

function sendVerificationCode() {
    const email = document.getElementById('register-email').value;
    if (!email.endsWith('@gmail.com')) {
        const registerMessage = document.getElementById('register-message');
        registerMessage.innerText = 'E-posta @gmail.com ile bitmelidir';
        registerMessage.className = 'notification error';
        setTimeout(() => {
            registerMessage.innerText = '';
            registerMessage.className = '';
        }, 3000);
        return;
    }
    fetch('http://localhost:5000/send_verification_code', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email })
    })
    .then(response => response.json())
    .then(data => {
        const registerMessage = document.getElementById('register-message');
        if (data.message === 'Verification code sent') {
            document.getElementById('verification-section').classList.remove('hidden');
            startTimer('verification-timer');
        } else {
            registerMessage.innerText = 'E-posta bulunamadı';
            registerMessage.className = 'notification error';
            setTimeout(() => {
                registerMessage.innerText = '';
                registerMessage.className = '';
            }, 3000);
        }
    });
}

function sendForgotPasswordCode() {
    const email = document.getElementById('forgot-email').value;
    fetch('http://localhost:5000/send_forgot_password_code', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email })
    })
    .then(response => response.json())
    .then(data => {
        const forgotMessage = document.getElementById('forgot-message');
        if (data.message === 'Verification code sent') {
            document.getElementById('forgot-verification-section').classList.remove('hidden');
            forgotMessage.innerText = ''; // Clear the error message
            startTimer('forgot-timer');
        } else {
            forgotMessage.innerText = 'E-posta bulunamadı';
            forgotMessage.className = 'notification error';
        }
    });
}

document.getElementById('forgot-email').addEventListener('input', () => {
    document.getElementById('forgot-message').innerText = '';
});

function startTimer(timerId) {
    let timeLeft = 300;
    const timerElement = document.getElementById(timerId);
    const interval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(interval);
            timerElement.innerText = 'Süre doldu';
        } else {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerElement.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            timeLeft--;
        }
    }, 1000);
}

function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, password: password })
    })
    .then(response => response.json())
    .then(data => {
        const loginMessage = document.getElementById('login-message');
        if (data.message === 'Login successful') {
            loginMessage.innerText = 'Giriş başarılı';
            loginMessage.className = 'notification success';
            userEmail = email; // Set the user's email
            userProgress = data.progress; // Set the user's progress
            userImages = data.images; // Set the user's images
            setTimeout(() => {
                showNewPage();
            }, 2000);
        } else {
            loginMessage.innerText = 'E-posta veya şifre yanlış';
            loginMessage.className = 'notification error';
        }
    });
}

function showNewPage() {
    document.getElementById('main-page').classList.add('hidden');
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('register-page').classList.add('hidden');
    document.getElementById('forgot-password-page').classList.add('hidden');
    document.getElementById('new-page').classList.remove('hidden');
}

function logout() {
    document.getElementById('new-page').classList.add('hidden');
    showMainPage();
}

function register() {
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const registerMessage = document.getElementById('register-message');

    if (password !== confirmPassword) {
        registerMessage.innerText = 'Şifreler uyuşmuyor';
        registerMessage.className = 'notification error';
        return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,16}$/;
    if (!passwordRegex.test(password)) {
        registerMessage.innerText = 'Şifre en az 6, en fazla 16 karakter olmalı, bir büyük harf, bir küçük harf ve bir sayı içermelidir';
        registerMessage.className = 'notification error';
        return;
    }

    fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, password: password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'User registered') {
            registerMessage.innerText = 'Kayıt başarılı';
            registerMessage.className = 'notification success';
            setTimeout(() => {
                document.getElementById('register-page').classList.add('hidden');
                showLoginPage();
            }, 2000); // Redirect to login page after 2 seconds
        } else {
            registerMessage.innerText = 'E-posta zaten kayıtlı';
            registerMessage.className = 'notification error';
        }
    });
}

function resetPassword() {
    const email = document.getElementById('forgot-email').value;
    const verificationCode = document.getElementById('forgot-verification-code').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmNewPassword = document.getElementById('confirm-new-password').value;

    if (newPassword !== confirmNewPassword) {
        document.getElementById('forgot-message').innerText = 'Şifreler uyuşmuyor';
        document.getElementById('forgot-message').className = 'notification error';
        return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,16}$/;
    if (!passwordRegex.test(newPassword)) {
        document.getElementById('forgot-message').innerText = 'Şifre en az 6, en fazla 16 karakter olmalı, bir büyük harf, bir küçük harf ve bir sayı içermelidir';
        document.getElementById('forgot-message').className = 'notification error';
        return;
    }

    fetch('http://localhost:5000/reset_password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, code: verificationCode, new_password: newPassword })
    })
    .then(response => response.json())
    .then(data => {
        const forgotMessage = document.getElementById('forgot-message');
        if (data.message === 'Password reset successful') {
            forgotMessage.innerText = 'Şifre başarıyla sıfırlandı';
            forgotMessage.className = 'notification success';
            setTimeout(() => {
                document.getElementById('forgot-password-page').classList.add('hidden');
                showLoginPage();
            }, 2000); // Redirect to login page after 2 seconds
        } else {
            forgotMessage.innerText = 'Geçersiz veya süresi dolmuş kod';
            forgotMessage.className = 'notification error';
        }
    });
}

function guestLogin() {
    showNewPage();
}

// function closeApplication() {
//     window.open('', '_self').close(); // Close the browser tab
// }

function exitGame() {
    // Implement the exit game logic
}

function showAboutPage() {
    // Implement the about page logic
}
