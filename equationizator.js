var NUMBER_OF_EQUATIONS = 9;
var MAXIMUM_DIGIT = 30;

// Pattern for an equation parsing
var EQUATION_PATTERN = /(\d+)(\+|\-)(\d+)=(\d+)/;

// Equation`s parts
var DIGIT_ONE;
var SIGN;
var DIGIT_TWO;
var RESULT;

var DIGIT_REQUIRED = 'Напиши число! 😐';
var CORRECT_RESULT = 'Правильно! 😉';
var INCORRECT_RESULT = 'Неправильно... 😰';

window.onload = function () {
    addEquationToField();
    checkResult();
}

function addEquationToField() {
    var field = document.querySelector('.equations_field');
    for (var i = 0; i < NUMBER_OF_EQUATIONS - 3; i++) {
        field.appendChild(createRandomEquationType());
    }
}

// Equation member constructor
function createMember(element, elemClass, value) {
    var member = document.createElement(element);
    member.classList.add('member');
    member.classList.add(elemClass);
    member.innerHTML = value;
    return member;
}

function createDigit() {
    return createMember('div', 'digit_member', createRandomDigit());
}

function createInput() {
    var input = createMember('input', 'input_member', null);
    input.maxLength = 3;
    input.type = 'text';
    return input;
}

function createSign() {
    return createMember('div', 'sign_member', createRandomSign());
}

function createEqually() {
    return createMember('div', 'equally_member', '=');
}

function createResult() {
    return createMember('div', 'result_member', createRandomDigit());
}

function createCheckResult() {
    var checkResult = createMember('div', 'check_result', '');
    checkResult.classList.remove('member');
    return checkResult;
}

function createRandomSign() {
    return Math.random() > 0.5 ? '+' : '-';
}

function createRandomDigit() {
    return Math.ceil(Math.random() * MAXIMUM_DIGIT);
}

// Equation constructor
function createEquation(digitOrInputOne, sign, digitOrInputTwo, equally, digitOrInputThree, checkResult) {
    var equation = document.createElement('div');
    equation.classList.add('equation');
    equation.appendChild(digitOrInputOne);
    equation.appendChild(sign);
    equation.appendChild(digitOrInputTwo);
    equation.appendChild(equally);
    equation.appendChild(digitOrInputThree);
    equation.appendChild(checkResult);
    return equation;
}

function createRandomEquationType() {
    var randomEquation = Math.random();
    if (randomEquation < 0.33) {
        equation = createEquationTypeOne();
    } else if (randomEquation > 0.66) {
        equation = createEquationTypeThree();
    } else {
        equation = createEquationTypeTwo();
    }
    return equation;
}

function createEquationTypeOne() {
    return createEquation(createDigit(), createSign(), createInput(),
        createEqually(), createResult(), createCheckResult());
}

function createEquationTypeTwo() {
    return createEquation(createDigit(), createSign(), createDigit(),
        createEqually(), createInput(), createCheckResult());
}

function createEquationTypeThree() {
    return createEquation(createInput(), createSign(), createDigit(),
        createEqually(), createResult(), createCheckResult());
}

function checkResult() {
    document.querySelector('.check_button').addEventListener('click', checkAllEquations);
}

function checkAllEquations() {
    Array.from(document.getElementsByClassName('equation')).forEach(function (item) {
        isAnswerCorrect(item);
    });
}

function isAnswerCorrect(item) {
    var inputOfEquation = item.querySelector('.input_member');
    var checkResultString = item.querySelector('.check_result');
    if (isNumeric(inputOfEquation.value)) {
        inputOfEquation.classList.remove('empty_value');
        checkResultString.innerHTML =
            isCalculateResultEqualsResult(transformEquationDomToString(item)) ? CORRECT_RESULT : INCORRECT_RESULT;
    } else {
        inputOfEquation.classList.add('empty_value');
        checkResultString.innerHTML = DIGIT_REQUIRED;
    }
}

function isNumeric(value) {
    return !isNaN(parseInt(value));
}

function isCalculateResultEqualsResult(equationString) {
    if (checkEquationStringFormat(equationString)) {
        parseEquationString(equationString);
        return calculateResult() == RESULT;
    } else {
        console.error('Неверный формат уравнения');
        return false;
    }
}

function transformEquationDomToString(equation) {
    var quationString = '';
    Array.from(equation.getElementsByClassName('member')).forEach(function (item) {
        quationString += getValueFromEquationMember(item);
    });
    return quationString;
}

function getValueFromEquationMember(equationMember) {
    var memberValue;
    if (equationMember.classList.contains('input_member')) {
        memberValue = parseInt(equationMember.value);
    } else {
        memberValue = equationMember.innerHTML;
    }
    return memberValue;
}

function checkEquationStringFormat(equationString) {
    return EQUATION_PATTERN.test(equationString);
}

function parseEquationString(equationString) {
    var equationArray = EQUATION_PATTERN.exec(equationString);
    DIGIT_ONE = equationArray[1];
    SIGN = equationArray[2];
    DIGIT_TWO = equationArray[3];
    RESULT = equationArray[4];
}

function calculateResult() {
    return isAdditionDigits() ? additionDigits() : subtractionDigits();
}

function isAdditionDigits() {
    return SIGN == '+';
}

function additionDigits() {
    return parseInt(DIGIT_ONE) + parseInt(DIGIT_TWO);
}

function subtractionDigits() {
    return parseInt(DIGIT_ONE) - parseInt(DIGIT_TWO);
}
