document.addEventListener("DOMContentLoaded", () => {
    const BASE_URL = "http://127.0.0.1:8000"; // Define the base URL for API requests

    // Grab all form elements from the DOM
    const forms = {
        login: document.querySelector(".form-box.login form"),
        register: document.querySelector(".form-box.register form"),
        otp: document.querySelector(".form-box.otp form"),
        forgotPassword: document.querySelector(".form-box.forgot-password form")
    };

    // Grab button elements inside each form
    const buttons = {
        login: forms.login.querySelector(".btn"),
        register: forms.register.querySelector(".sign-up-btn"),
        verifyOtp: forms.otp.querySelector(".verify-otp"),
        forgotPassword: forms.forgotPassword.querySelector(".send-reset-link")
    };

    // Grab the links that switch between forms
    const links = {
        login: document.querySelector(".login-link"),
        register: document.querySelector(".register-link"),
        forgotPassword: document.querySelector(".forgot-password-link"),
        backToLogin: document.querySelector(".back-to-login")
    };

    let otpRoute = ""; // Holds the route for OTP verification
    let otpBody = {}; // Holds the body for OTP verification request

    // Event listeners for switching forms (register, login, forgot password, etc.)
    links.register.addEventListener("click", () => showForm("register"));
    links.login.addEventListener("click", () => showForm("login"));
    links.forgotPassword.addEventListener("click", () => showForm("forgot-password"));
    links.backToLogin.addEventListener("click", () => showForm("login"));

    // Handle the registration form submission
    buttons.register.addEventListener("click", async (event) => {
        event.preventDefault(); // Prevent form submission

        const registerName = forms.register.querySelector("input[name='full-name']").value;
        const registerEmail = forms.register.querySelector("input[name='email']").value;
        const registerPassword = forms.register.querySelector("input[name='password']").value;

        const body = {
            name: registerName,
            email: registerEmail,
            password: registerPassword
        };

        try {
            const response = await axios.post(`${BASE_URL}/api/user/signup`, body, {
                withCredentials: true // Send cookies with request
            });

            console.log("Registration successful:", response.data);
            otpRoute = `${BASE_URL}/api/user/validateSignupOtp`; // OTP route for validation
            otpBody = body; // Save the user data for OTP verification

            showPopup("✅ Registration successful! Proceeding to OTP verification...", 3000);

            // Show OTP form after 3 seconds
            setTimeout(() => {
                showForm("otp");
            }, 3000);
        } catch (error) {
            console.error("Registration failed:", error.response || error);
            alert("Registration failed. Please try again.");
        }
    });

    // Handle OTP verification
    buttons.verifyOtp.addEventListener("click", async (event) => {
        event.preventDefault(); // Prevent form submission

        const otpCode = forms.otp.querySelector("input#otp-input").value;

        if (otpCode.length === 6) { // Check if OTP is 6 digits long
            otpBody.otp = otpCode; // Add OTP code to the body

            try {
                const response = await axios.post(otpRoute, otpBody, {
                    withCredentials: true // Send cookies with request
                });

                console.log("OTP verification successful:", response.data);
                showPopup("✅ OTP Validation Success! Redirecting to Login...", 3000);

                // Show login form after 3 seconds
                setTimeout(() => {
                    showForm("login");
                }, 3000);
            } catch (error) {
                console.error("OTP verification failed:", error.response || error);
                alert("OTP verification failed. Please try again.");
            }
        } else {
            alert("Please enter a valid 6-digit OTP.");
        }
    });

    // Handle login form submission
    buttons.login.addEventListener("click", async (event) => {
        event.preventDefault(); // Prevent form submission
    
        const loginEmail = forms.login.querySelector("input[type='email']").value;
        const loginPassword = forms.login.querySelector("input[type='password']").value;
    
        const body = {
            email: loginEmail,
            password: loginPassword
        };
    
        try {
            const response = await axios.post(`${BASE_URL}/api/user/login`, body, {
                withCredentials: true // Send cookies with request
            });
    
            console.log("Login successful:", response.data);
            showPopup("✅ Login successful! Redirecting to Dashboard...", 1000);
    
            const profileRes = await fetch(`${BASE_URL}/api/user/profile`, {
                credentials: 'include' // Include cookies in the request
            });
    
            if (!profileRes.ok) throw new Error('Could not fetch profile');
            const profile = await profileRes.json();
            const userRoute = profile["user Route"];
    
            if (!userRoute) {
                // Redirect to dashboard with first time flag
                setTimeout(() => {
                    window.location.href = "dashboard.html?firstTime=true";
                }, 1000);
            } else {
                setTimeout(() => {
                    window.location.href = "dashboard.html";
                }, 1000);
            }
    
        } catch (error) {
            console.error("Login failed:", error.response || error);
            alert("Login failed. Please check your credentials.");
        }
    });

    // Handle forgot password form submission
    buttons.forgotPassword.addEventListener("click", async (event) => {
        event.preventDefault(); // Prevent form submission

        const forgotPasswordEmail = forms.forgotPassword.querySelector("input[type='email']").value;
        const newPassword = forms.forgotPassword.querySelector("input[type='password']").value;

        const body = {
            email: forgotPasswordEmail,
            newPassword: newPassword
        };

        try {
            const response = await axios.post(`${BASE_URL}/api/user/forgotPassword`, body, {
                withCredentials: true // Send cookies with request
            });

            console.log("Forgot password request successful:", response.data);
            otpRoute = `${BASE_URL}/api/user/resetPassword`; // OTP route for reset password
            otpBody = body; // Save the body for OTP verification

            showPopup("✅ Reset link sent! Proceeding to OTP verification...", 3000);
            setTimeout(() => {
                showForm("otp");
            }, 3000);
        } catch (error) {
            console.error("Forgot password failed:", error.response || error);
            alert("Failed to send reset link. Please try again.");
        }
    });

    // Function to show a popup message with a specified duration
    function showPopup(message, duration) {
        const popup = document.createElement("div");
        popup.textContent = message;
        popup.style.position = "fixed";
        popup.style.top = "20px";
        popup.style.left = "50%";
        popup.style.transform = "translateX(-50%)";
        popup.style.background = "#4CAF50";
        popup.style.color = "white";
        popup.style.padding = "10px 20px";
        popup.style.borderRadius = "5px";
        popup.style.zIndex = "1000";
        popup.style.fontSize = "16px";
        document.body.appendChild(popup);

        // Remove the popup after the specified duration
        setTimeout(() => {
            popup.remove();
        }, duration);
    }

    // Function to show the appropriate form (login, register, forgot password, or OTP)
    function showForm(formType) {
        document.querySelector(".form-box.login").style.display = formType === "login" ? "block" : "none";
        document.querySelector(".form-box.register").style.display = formType === "register" ? "block" : "none";
        document.querySelector(".form-box.otp").style.display = formType === "otp" ? "block" : "none";
        document.querySelector(".form-box.forgot-password").style.display = formType === "forgot-password" ? "block" : "none";
    }
});
