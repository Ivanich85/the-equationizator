var NUMBER_OF_EQUATIONS = 9;
var MAXIMUM_DIGIT = 27;

// Pattern for an equation parsing
var EQUATION_PATTERN = /(\d+)(\+|\-)(\d+)=(\d+)/;

// Equation`s parts
var DIGIT_ONE;
var SIGN;
var DIGIT_TWO;
var RESULT;

// Values for equations
var DIGIT_ONE_VALUE;
var DIGIT_TWO_VALUE;
var SIGN_VALUE;

var WRITE_ANSWER = '😉';
var DIGIT_REQUIRED = 'Напиши ответ! 😡';
var CORRECT_RESULT = 'Правильно! 😍';
var INCORRECT_RESULT = 'Неправильно... 😰';

var SIGN_PLUS = '+';
var SIGN_MINUS = '-';

var NUMBER_OF_TRIES = 3;
var BUTTON_TEXT = 'Проверить ответ. \nОсталось попыток: ';

window.onload = function () {
    addEquationToField();
    checkResult();
}

function addEquationToField() {
    var field = document.querySelector('.equations_field');
    for (var i = 0; i < NUMBER_OF_EQUATIONS; i++) {
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

function createDigit(value) {
    return createMember('div', 'digit_member', value);
}

function createInput() {
    var input = createMember('input', 'input_member', null);
    input.maxLength = 3;
    input.type = 'text';
    return input;
}

function createSign(value) {
    return createMember('div', 'sign_member', value);
}

function createEqually() {
    return createMember('div', 'equally_member', '=');
}

function createResult(value) {
    return createMember('div', 'result_member', value);
}

function createCheckResult() {
    var checkResult = createMember('div', 'check_result', '');
    checkResult.classList.remove('member');
    checkResult.innerHTML = WRITE_ANSWER;
    return checkResult;
}

function createRandomSign() {
    return Math.random() > 0.5 ? SIGN_PLUS : SIGN_MINUS;
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

function generateDigitValuesAndSignValue() {
    DIGIT_ONE_VALUE = createRandomDigit();
    DIGIT_TWO_VALUE = createRandomDigit();
    SIGN_VALUE = createRandomSign();
    if (isEquationResultNegativeNumber()) {
        generateDigitValuesAndSignValue();
    }
}

function isEquationResultNegativeNumber() {
    var signValueMinus = SIGN_VALUE == SIGN_PLUS && DIGIT_ONE_VALUE > DIGIT_TWO_VALUE;
    var signValuePlus = SIGN_VALUE == SIGN_MINUS && DIGIT_ONE_VALUE < DIGIT_TWO_VALUE;
    return signValueMinus || signValuePlus;
}

function createRandomEquationType() {
    generateDigitValuesAndSignValue();
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
    return createEquation(createDigit(DIGIT_ONE_VALUE), createSign(SIGN_VALUE), createInput(),
        createEqually(), createResult(DIGIT_TWO_VALUE), createCheckResult());
}

function createEquationTypeTwo() {
    return createEquation(createDigit(DIGIT_ONE_VALUE), createSign(SIGN_VALUE), createDigit(DIGIT_TWO_VALUE),
        createEqually(), createInput(), createCheckResult());
}

function createEquationTypeThree() {
    return createEquation(createInput(), createSign(SIGN_VALUE), createDigit(DIGIT_ONE_VALUE),
        createEqually(), createResult(DIGIT_TWO_VALUE), createCheckResult());
}

function checkResult() {
    var button = document.querySelector('.check_button');
    uploadButtonText(button);
    button.addEventListener('click', checkAllEquations);
}

function checkAllEquations() {
    Array.from(document.getElementsByClassName('equation')).forEach(function (item) {
        isAnswerCorrect(item);
    });
    disabledButton(checkIsWin());
}

function disabledButton(isWinOrLose) {
    document.querySelector('.check_button').disabled = isWinOrLose;
}

function checkIsWin() {
    decreaseTries();
    uploadButtonText();
    if (allResultsAreCorrect()) {
        console.log("Молодец!");
        return true;
    } else if (NUMBER_OF_TRIES <= 0) {
        console.log("Поражение");
        return true;
    }
}

function uploadButtonText() {
    var button = document.querySelector('.check_button');
    button.textContent = BUTTON_TEXT + NUMBER_OF_TRIES;
}

function decreaseTries() {
    NUMBER_OF_TRIES--;
}

function allResultsAreCorrect() {
    var correctResultsNumber = 0;
    Array.from(document.getElementsByClassName('check_result')).forEach(function (item) {
        if (item.innerHTML == CORRECT_RESULT) {
            correctResultsNumber++;
            console.log(correctResultsNumber);
        }
    });
    return correctResultsNumber == NUMBER_OF_EQUATIONS;
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
    return SIGN == SIGN_PLUS;
}

function additionDigits() {
    return parseInt(DIGIT_ONE) + parseInt(DIGIT_TWO);
}

function subtractionDigits() {
    return parseInt(DIGIT_ONE) - parseInt(DIGIT_TWO);
}
