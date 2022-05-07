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
    return a / b;
}

function operate(a, b, operator) {
    let result;

    switch (operator) {
        case '+':
            result = add(a, b);
            break;
        case '-':
            result = substract(a, b);
            break;
        case '\xD7':
            result = multiply(a, b);
            break;
        case '\xF7':
            result = divide(a, b);
            break;
    }
    return result;
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
    const updatedValue = (value === '0') ? newValue : value + newValue;
    updateDisplay(updatedValue);
    return updatedValue;
}

function giveResult() {
    if (variables.operator === '') return;

    const result = operate(+variables.a, +variables.b, variables.operator);
    updateDisplay(result);
    variables.a = `${result}`; // We keep it on a to chain operations
    variables.b = '0';
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
    if (variables.firstOperand) {
        variables.a = updateValue(variables.a, operandValue);
    } else {
        variables.b = updateValue(variables.b, operandValue);
    }
}

function processButton(event) {
    const button = event.target;
    const content = button.textContent;

    if (content === '=') {
        giveResult();
    } else if (content === 'C') {
        clear();
    } else if (content === '.') {
        if (!isDecimal()) {
            handleOperand(content);
        }
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
