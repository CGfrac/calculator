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

function updateDisplay(value) {
    display.textContent = value;
}

function updateValue(value, newValue) {
    const updatedValue = (value === '0') ? newValue : value + newValue;
    updateDisplay(updatedValue);
    return updatedValue;
}

function giveResult() {
    if (operator === '') return;

    const result = operate(+a, +b, operator);
    updateDisplay(result);
    a = `${result}`; // We keep it on a to chain operations
    b = '0';
}

function clear() {
    a = '0';
    b = '0';
    operator = '';
    firstOperand = true;
    updateDisplay(a);
}

function processButton(event) {
    const button = event.target;
    const content = button.textContent;

    if (content === '=') {
        giveResult();
    } else if (content === 'C') {
        clear();
    } else if (button.classList.contains('operand')) {
        if (firstOperand) {
            a = updateValue(a, content);
        } else {
            b = updateValue(b, content);
        }
    } else if (button.classList.contains('operator')) {
        if (firstOperand) {
            firstOperand = false;
        } else {
            giveResult();
        }
        operator = content;
    }
}

const display = document.querySelector('#display p');
const buttons = document.querySelectorAll('.button');

buttons.forEach(button => button.addEventListener('click', processButton));

let a = '0';
let b = '0';
let operator = '';
let firstOperand = true;
