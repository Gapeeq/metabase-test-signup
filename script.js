document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('email');
    const submitButton = document.getElementById('submitButton');

    // Focus the first name field on page load
    firstNameInput.focus();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Track if a field has been touched (focused at least once)
    const touched = {
        firstName: false,
        lastName: false,
        email: false
    };

    function setLabelError(input, showError) {
        const label = input.previousElementSibling.querySelector('label');
        const requiredMarker = label.querySelector('.required-marker');
        if (showError) {
            requiredMarker.textContent = ': required';
            label.classList.add('error');
            input.classList.add('error');
        } else {
            requiredMarker.textContent = '';
            label.classList.remove('error');
            input.classList.remove('error');
        }
    }

    function validateField(input, validationFn) {
        const value = input.value.trim();
        if (!value) return false;
        if (validationFn) return validationFn(value);
        return true;
    }

    function validateEmail(email) {
        return emailRegex.test(email);
    }

    function updateAllFieldWarnings() {
        setLabelError(firstNameInput, touched.firstName && !validateField(firstNameInput));
        setLabelError(lastNameInput, touched.lastName && !validateField(lastNameInput));
        setLabelError(emailInput, touched.email && !validateField(emailInput, validateEmail));
    }

    function validateForm() {
        const isFirstNameValid = validateField(firstNameInput);
        const isLastNameValid = validateField(lastNameInput);
        const isEmailValid = validateField(emailInput, validateEmail);
        submitButton.disabled = !(isFirstNameValid && isLastNameValid && isEmailValid);
    }

    // Real-time validation
    [
        {input: firstNameInput, key: 'firstName'},
        {input: lastNameInput, key: 'lastName'},
        {input: emailInput, key: 'email'}
    ].forEach(({input, key}) => {
        input.addEventListener('focus', () => {
            touched[key] = true;
        });
        input.addEventListener('input', () => {
            updateAllFieldWarnings();
            validateForm();
        });
        input.addEventListener('blur', () => {
            updateAllFieldWarnings();
            validateForm();
        });
    });

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // Mark all as touched on submit
        touched.firstName = true;
        touched.lastName = true;
        touched.email = true;
        updateAllFieldWarnings();
        validateForm();
        if (!submitButton.disabled) {
            // Redirect to the specified URL with form values as parameters
            const fn = encodeURIComponent(firstNameInput.value.trim());
            const ln = encodeURIComponent(lastNameInput.value.trim());
            const email = encodeURIComponent(emailInput.value.trim());
            const url = `http://138.199.205.163:5000/registration?fn=${fn}&ln=${ln}&email=${email}`;
            window.location.href = url;
        }
    });
}); 