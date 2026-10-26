const form = document.querySelector('[data-js="form"]');

const SELECTORS = {
  input: '[data-js="input"]',
  field: '[data-js="field"]',
  errorMessage: '[data-js="error-message"]',
};

const VALIDATION_MESSAGES = {
  required: {
    "first-name": "First Name cannot be empty",
    "last-name": "Last Name cannot be empty",
    email: "Email Address cannot be empty",
    password: "Password cannot be empty",
  },
  invalidEmail: "Looks like this is not an email",
};

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateField(input) {
  const value = input.value.trim();

  if (!value) {
    return {
      isValid: false,
      message: VALIDATION_MESSAGES.required[input.name],
    };
  }

  if (input.name === "email" && !isValidEmail(value)) {
    return {
      isValid: false,
      message: VALIDATION_MESSAGES.invalidEmail,
    };
  }

  return {
    isValid: true,
    message: "",
  };
}

function updateFieldState(input, validation) {
  const field = input.closest(SELECTORS.field);
  const errorMessage = field.querySelector(SELECTORS.errorMessage);

  if (validation.isValid) {
    delete field.dataset.state;
  } else {
    field.dataset.state = "invalid";
  }

  if (input.type === "email" && !validation.isValid) {
    input.placeholder = "email@example/com";
  }

  input.setAttribute("aria-invalid", String(!validation.isValid));
  errorMessage.textContent = validation.message;
}

function validateForm() {
  const inputs = [...form.querySelectorAll(SELECTORS.input)];

  let firstInvalidInput = null;

  inputs.forEach((input) => {
    const validation = validateField(input);

    updateFieldState(input, validation);

    if (!validation.isValid && !firstInvalidInput) {
      firstInvalidInput = input;
    }
  });

  if (firstInvalidInput) {
    firstInvalidInput.focus();
    return false;
  }

  return true;
}

// Inicializar los campos sin errores.
const inputs = [...form.querySelectorAll(SELECTORS.input)];

inputs.forEach((input) => {
  updateFieldState(input, {
    isValid: true,
    message: "",
  });

  // Validar el campo en cada modificación.
  input.addEventListener("input", () => {
    const validation = validateField(input);

    updateFieldState(input, validation);
  });
});

// Validar todos los campos al enviar.
form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validateForm()) return;

  // Aquí iría el envío real al servidor o a la API.
  console.log("Formulario válido");
});
