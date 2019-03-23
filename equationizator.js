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
    checkResult();
}

function checkResult() {
    document.querySelector('.check_button').addEventListener('click', checkAllEquations);
}

function checkAllEquations() {
    Array.from(document.getElementsByClassName('equation')).forEach(function (item) {
        checkInputValue(item);
    });
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

function checkInputValue(item) {
    var inputOfEquation = item.querySelector('.input_member');
    var checkResultString = item.querySelector('.check_result');
    if (isNumeric(inputOfEquation.value)) {
        inputOfEquation.classList.remove('empty_value');
        // вот здесь проверяем верный ответ или нет
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
