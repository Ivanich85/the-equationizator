var NUMBER_OF_EQUATIONS = 9;

var MAXIMUM_DIGIT = 12;
var NUMBER_OF_TRIES = 2;

// Pattern for an equation parsing
var EQUATION_PATTERN = /(\d+)(\+|\-)(\d+)=(\d+)/;

// Check result string classes
var INCORRECT_ANSWER = 'incorrect_answer';
var EMPTY_VALUE = 'empty_answer';
var CORRECT_ANSWER = 'correct_answer';

// log
var INCORRECT_EQUATION_FORMAT = 'Неверный формат уравнения';

// Equation`s parts
var DIGIT_ONE;
var SIGN;
var DIGIT_TWO;
var RESULT;

// Values for equations
var DIGIT_ONE_VALUE;
var DIGIT_TWO_VALUE;
var SIGN_VALUE;

var SIGN_PLUS = '+';
var SIGN_MINUS = '-';

var BUTTON_TEXT = 'Проверить ответ. Осталось попыток: ';

var WRITE_ANSWER = '😉';
var DIGIT_REQUIRED = 'Напиши ответ! 😡';
var CORRECT_RESULT = 'Правильно! 😍';
var INCORRECT_RESULT = 'Неправильно... 😰';

var GRADE_TWO = 'Плохо 2';
var GRADE_THREE = 'Удовл. 3';
var GRADE_FOUR = 'Хор. 4';
var GRADE_FIVE = 'Отл. 5';

window.onload = function () {
    gameStart();
}

function gameStart() {
    addEquationToField();
    activateResultButton();
}

function addEquationToField() {
    var field = document.querySelector('.equations_field');
    for (var i = 0; i < NUMBER_OF_EQUATIONS; i++) {
        //field.appendChild(createExamplesOnly()); // Генерировать только примеры
        field.appendChild(createExamplesAndEquations()); // Генерировать уравнения и примеры
    }
}

function createExamplesAndEquations() {
    var equation = null;
    generateDigitValuesAndSignValue();
    var randomEquation = Math.random();
    if (randomEquation < 0.33) {
        equation = createExample();
    } else if (randomEquation > 0.66) {
        equation = createEquationTypeOne();
    } else {
        equation = createEquationTypeTwo();
    }
    return equation;
}

function createExamplesOnly() {
    generateDigitValuesAndSignValue();
    return createExample();
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

// Обычный пример
function createExample() {
    return createEquation(createDigit(DIGIT_ONE_VALUE), createSign(SIGN_VALUE), createDigit(DIGIT_TWO_VALUE),
        createEqually(), createInput(), createCheckResult());
}

// Уравнение 1
function createEquationTypeOne() {
    return createEquation(createDigit(DIGIT_ONE_VALUE), createSign(SIGN_VALUE), createInput(),
        createEqually(), createResult(DIGIT_TWO_VALUE), createCheckResult());
}

// Уравнение 2
function createEquationTypeTwo() {
    return createEquation(createInput(), createSign(SIGN_VALUE), createDigit(DIGIT_ONE_VALUE),
        createEqually(), createResult(DIGIT_TWO_VALUE), createCheckResult());
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

function activateResultButton() {
    var button = document.querySelector('.check_button');
    uploadButtonText(button);
    button.addEventListener('click', checkAllEquations);
}

function checkAllEquations() { 
    decreaseTries();
    uploadButtonText();  
    Array.from(document.getElementsByClassName('equation')).forEach(function (item) {
        isAnswerCorrect(item);
    });
    if (isWin() || isGameOver()) {
        disabledButton();
        getGrade();
    }
}

function disabledButton() {
    document.querySelector('.check_button').disabled = true;
}

function isWin() {    
    return Array.from(document.getElementsByClassName('equation correct_answer')).length == NUMBER_OF_EQUATIONS;
}

function isGameOver() {    
    return NUMBER_OF_TRIES <= 0;
}

function getGrade() {
    var grade = document.querySelector('.grade');
    var correctAnswersPercent = Array.from(document.getElementsByClassName('equation correct_answer')).length / NUMBER_OF_EQUATIONS;
    if (correctAnswersPercent >= 0.9) {
        grade.innerHTML = GRADE_FIVE;
    } else if (correctAnswersPercent >= 0.75 && correctAnswersPercent < 0.9) {
        grade.innerHTML = GRADE_FOUR;
    } else if (correctAnswersPercent >= 0.6 && correctAnswersPercent < 0.75) {
        grade.innerHTML = GRADE_THREE;
    } else {
        grade.innerHTML = GRADE_TWO;
    }
    grade.classList.add('grade_animate');
}

function uploadButtonText() {
    var button = document.querySelector('.check_button');
    button.textContent = BUTTON_TEXT + NUMBER_OF_TRIES;
}

function decreaseTries() {
    NUMBER_OF_TRIES--;
}

function isAnswerCorrect(item) {
    var inputOfEquation = item.querySelector('.input_member');
    var checkResultString = item.querySelector('.check_result');
    if (isNumeric(inputOfEquation.value)) {
        inputOfEquation.classList.remove(EMPTY_VALUE);
        createResultString(item, isCalculateResultEqualsResult(transformEquationDomToString(item)));
    } else {
        inputOfEquation.classList.add(EMPTY_VALUE);
        removeCorrectOrIncorrectColors(item);
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
        console.error(INCORRECT_EQUATION_FORMAT);
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

function createResultString(item, resultCorrect) {
    var checkResultString = item.querySelector('.check_result'); 
    if (resultCorrect) {
        checkResultString.innerHTML = CORRECT_RESULT;
        coloredElemCorrect(item);
    } else {
        checkResultString.innerHTML = INCORRECT_RESULT;
        coloredElemIncorrect(item);
    }
}

function coloredElemCorrect(elem) {
    var input = elem.querySelector('.input_member');
    elem.classList.add(CORRECT_ANSWER);
    elem.classList.remove(INCORRECT_ANSWER);
    input.classList.add(CORRECT_ANSWER);
    input.classList.remove(INCORRECT_ANSWER);
}

function coloredElemIncorrect(elem) {
    var input = elem.querySelector('.input_member');
    elem.classList.remove(CORRECT_ANSWER);
    elem.classList.add(INCORRECT_ANSWER);
    input.classList.remove(CORRECT_ANSWER);
    input.classList.add(INCORRECT_ANSWER);
}

function removeCorrectOrIncorrectColors(elem) {
    var input = elem.querySelector('.input_member');
    elem.classList.remove(CORRECT_ANSWER);
    elem.classList.remove(INCORRECT_ANSWER);
    input.classList.remove(CORRECT_ANSWER);
    input.classList.remove(INCORRECT_ANSWER);
}
