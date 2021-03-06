const SNARKY_ERROR_MESSAGE = 'lol';
const DISPLAY_LIMIT = 10;

function add(a, b) {
    return a + b;
}

function substract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) return SNARKY_ERROR_MESSAGE;
    return a / b;
}

function operate(a, b, operator) {
    switch (operator) {
        case '+':
            return add(a, b);
        case '-':
            return substract(a, b);
        case '\xD7':
            return multiply(a, b);
        case '\xF7':
            return divide(a, b);
    }
}

function Variables() {
    this.a = '0';
    this.b = '0';
    this.operator = '';
    this.activeOperatorButton = null;
    this.firstOperand = true;
}

function updateDisplay(value) {
    display.textContent = value;
}

function updateValue(value, newValue) {
    if (newValue === '.' && isDecimal(value)) return value;

    let updatedValue = (value === '0') ? newValue : value + newValue;

    if (updatedValue.length > DISPLAY_LIMIT) {
        updatedValue = parseFloat(updatedValue)
                    .toExponential(DISPLAY_LIMIT / 2)
                    .toString();
    }

    if (updatedValue === '.') {
        updatedValue = '0.';
    }

    updateDisplay(updatedValue);
    return updatedValue;
}

function giveResult() {
    if (variables.operator === '') return;

    let result = operate(+variables.a, +variables.b, variables.operator);

    if (result.toString().length > DISPLAY_LIMIT) {
        result = result.toExponential(DISPLAY_LIMIT / 2);
    }

    clear();
    updateDisplay(result);

    variables.a = `${result}`; // We keep it on a to chain operations
    variables.firstOperand = false;
}

function clear() {
    if (variables.activeOperatorButton) {
        variables.activeOperatorButton.classList.remove('active');
    }
    variables = new Variables();
    updateDisplay(variables.a);
}

function isDecimal() {
    if (variables.firstOperand) {
        return variables.a.includes('.');
    }
    return variables.b.includes('.');
}

function handleOperand(operandValue) {
    // If we enter a new operand right after a result or error, we want a clean state
    if (variables.operator === ''
        && !variables.firstOperand
        || variables.a === SNARKY_ERROR_MESSAGE) {
        clear();
    }

    if (variables.firstOperand) {
        variables.a = updateValue(variables.a, operandValue);
    } else {
        variables.b = updateValue(variables.b, operandValue);
    }
}

function handleOperator(operatorValue) {
    if (variables.firstOperand) {
        variables.firstOperand = false;
    } else {
        giveResult();
    }

    variables.operator = operatorValue;
}

function switchNegativePositive() {
    let value;

    if (variables.firstOperand || variables.operator === '') {
        value = `${+variables.a * -1}`;
        variables.a = value;
    } else {
        value = `${+variables.b * -1}`;
        variables.b = value;
    }

    updateDisplay(value);
}

function deleteLastDigit(string) {
    let newString = string.slice(0, string.length - 1);
    newString = (newString.length > 0) ? newString : '0';
    updateDisplay(newString);
    return newString;
}

function backspace() {
    if (variables.firstOperand) {
        variables.a = deleteLastDigit(variables.a);
    } else {
        variables.b = deleteLastDigit(variables.b);
    }
}

function processButton(event) {
    const button = event.target;

    button.classList.add('active');

    const content = button.textContent;

    switch (content) {
        case '=':
            giveResult();
            break;
        case 'C':
            clear();
            break;
        case '+/-':
            switchNegativePositive();
            break;
        case '\uD83E\uDC28':
            backspace();
            break;
        default:
            if (button.classList.contains('operand')) {
                handleOperand(content);
            } else { // Remaining possibility is always an operator
                handleOperator(content);
                variables.activeOperatorButton = button;
            }
    }
}

function removeBrightness(event) {
    const button = event.target;
    if (button !== variables.activeOperatorButton) {
        button.classList.remove('active');
    }
}

function processKeyboardInput(event) {
    let key = event.key;
    if (key === 'Enter') key = '=';

    const button = document.querySelector(`div[data-key="${key}"]`);

    if (button !== null) {
        button.click();
    }
}

const display = document.querySelector('#display p');
const buttons = document.querySelectorAll('.button');

buttons.forEach(button => button.addEventListener('click', processButton));
buttons.forEach(button => button.addEventListener('transitionend', removeBrightness));

document.addEventListener('keydown', processKeyboardInput);

let variables = new Variables();
