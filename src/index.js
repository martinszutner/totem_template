const Keyboard = window.SimpleKeyboard.default;
const InputMask = window.SimpleKeyboardInputMask.default;

// Inicialización de SimpleKeyboard con el módulo de inputMask
const keyboard = new Keyboard({
  onChange: input => onChange(input),
  onKeyPress: button => onKeyPress(button),
  modules: [InputMask], // Se importa el módulo correctamente
  inputMask: {
    dni: {
      mask: "00.000.000",  // Máscara de DNI
      regex: /^[0-9]+$/  // Expresión regular solo para números
    },
    dominio: {
      mask: "AAA000",  // Máscara para dominio
      regex: /^[A-Z]{3}\d{3}$/  // Patente tipo AAA-000
    }
  },
  disableCaretPositioning: true
});

let currentInputElement = null;

document.querySelectorAll(".input").forEach(inputElement => {
  inputElement.addEventListener("focus", event => {
    currentInputElement = event.target;
    keyboard.setInput(event.target.value);

    // Cambiar tipo de teclado basado en el campo de entrada
    if (currentInputElement.id === "dni" || currentInputElement.id === "dt_entrada" || currentInputElement.id === "dt_salida") {
      // Layout numérico
      keyboard.setOptions({
        layout: {
          default: ["1 2 3", "4 5 6", "7 8 9", "0 {bksp}", "SIGUIENTE"]
        }
      });
    } else if (currentInputElement.id === "dominio") {
      // Layout QWERTY
      keyboard.setOptions({
        layout: {
          default: [
            "1 2 3 4 5 6 7 8 9 0",
            "Q W E R T Y U I O P",
            "A S D F G H J K L",
            "Z X C V B N M {bksp}",
            "SIGUIENTE"
          ]
        }
      });
    }
  });

  inputElement.addEventListener("input", event => {
    keyboard.setInput(event.target.value);
  });
});

function onChange(input) {
  if (currentInputElement) {
    currentInputElement.value = input;
    console.log("Input changed", input);
  }
}

function onKeyPress(button) {
  console.log("Button pressed", button);

  if (button === "SIGUIENTE") {
    moveToNextInput();
  }

  if (button === "{shift}" || button === "{lock}") handleShift();
}

function moveToNextInput() {
  const inputs = document.querySelectorAll(".input");
  const currentIndex = Array.prototype.indexOf.call(inputs, currentInputElement);

  if (currentIndex >= 0 && currentIndex < inputs.length - 1) {
    inputs[currentIndex + 1].focus();
  } else if (currentIndex === inputs.length - 1) {
    inputs[0].focus();
  }
}

function handleShift() {
  let currentLayout = keyboard.options.layoutName;
  let shiftToggle = currentLayout === "default" ? "shift" : "default";

  keyboard.setOptions({
    layoutName: shiftToggle
  });
}
const dtEntradaInput = document.getElementById('dt_entrada');
const checkIcon1 = document.getElementById('check-icon-1');
const dtSalidaInput = document.getElementById('dt_salida');
const checkIcon2 = document.getElementById('check-icon-2');
const dniInput = document.getElementById('dni');
const checkIcon3 = document.getElementById('check-icon-3');
const dominioInput = document.getElementById('dominio');
const checkIcon4 = document.getElementById('check-icon-4');

function updateCheckIcon(inputElement, checkIcon, pattern) {
  const inputValue = inputElement.value.toUpperCase();
  inputElement.value = inputValue; // Convertir a mayúsculas en tiempo real

  if (pattern.test(inputValue)) {
    checkIcon.classList.remove('d-none');
  } else {
    checkIcon.classList.add('d-none');
  }
}

dtEntradaInput.addEventListener('input', () => {
  updateCheckIcon(dtEntradaInput, checkIcon1, /^\d{8}$/);
});

dtSalidaInput.addEventListener('input', () => {
  updateCheckIcon(dtSalidaInput, checkIcon2, /^\d{8}$/);
});

dniInput.addEventListener('input', () => {
  updateCheckIcon(dniInput, checkIcon3, /^\d{8}$/);
});

dominioInput.addEventListener('input', () => {
  // Permitir AAA-999 o AA-999-AA
  const dominioPattern = /^([A-Z]{3}\d{3}|[A-Z]{2}\d{3}[A-Z]{2})$/;
  updateCheckIcon(dominioInput, checkIcon4, dominioPattern);
});
