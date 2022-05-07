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
    this.firstOperand = true;
}

function updateDisplay(value) {
    display.textContent = value;
}

function updateValue(value, newValue) {
    let updatedValue = (value === '0') ? newValue : value + newValue;
    if (updatedValue.length > DISPLAY_LIMIT) {
        updatedValue = parseFloat(updatedValue)
                    .toPrecision(DISPLAY_LIMIT)
                    .toString();
    }
    updateDisplay(updatedValue);
    return updatedValue;
}

function giveResult() {
    if (variables.operator === '') return;

    let result = operate(+variables.a, +variables.b, variables.operator);

    if (result.toString().length > DISPLAY_LIMIT) {
        result = result.toPrecision(DISPLAY_LIMIT);
    }

    updateDisplay(result);
    variables.a = `${result}`; // We keep it on a to chain operations
    variables.b = '0';
    variables.operator = '';
}

function clear() {
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

function deleteLastChar(string) {
    let newString = string.slice(0, string.length - 1);
    newString = (newString.length > 0) ? newString : '0';
    updateDisplay(newString);
    return newString;
}

function backspace() {
    if (variables.firstOperand) {
        variables.a = deleteLastChar(variables.a);
    } else {
        variables.b = deleteLastChar(variables.b);
    }
}

function processButton(event) {
    const button = event.target;
    const content = button.textContent;

    if (content === '=') {
        if (!variables.firstOperand) giveResult();
    } else if (content === 'C') {
        clear();
    } else if (content === '.') {
        if (!isDecimal()) handleOperand(content);
    } else if (content === '+/-') {
        switchNegativePositive();
    } else if (content === '\uD83E\uDC28') {
        backspace();
    } else if (button.classList.contains('operand')) {
        handleOperand(content);
    } else if (button.classList.contains('operator')) {
        if (variables.firstOperand) {
            variables.firstOperand = false;
        } else {
            giveResult();
        }
        variables.operator = content;
    }
}

const display = document.querySelector('#display p');
const buttons = document.querySelectorAll('.button');

buttons.forEach(button => button.addEventListener('click', processButton));

let variables = new Variables();
