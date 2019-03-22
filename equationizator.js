
window.onload = function () {
    checkResult();
}

function checkResult() {
    var checkResultButton = document.querySelector('.check_button');
    checkResultButton.addEventListener('click', getAllEquations);
}

function getAllEquations() {
    Array.from(document.getElementsByClassName('equation')).forEach(function (item) {
        parseEquation(item);
    });
}

function parseEquation(equation) {
    var equationMembers = Array.from(equation.getElementsByClassName('member'));
    var digitOne;
    var sign;
    var digitTwo;
    var result;
    if (equationMembers.length == 5) {
        equationMembers.forEach(function (item, i) {
            switch (i) {
                case 0:
                    digitOne = getValueFromEquationMember(item);
                case 1:
                    sign = getValueFromEquationMember(item);
                case 2:
                    digitTwo = getValueFromEquationMember(item);
                // под номером 3 находится знак равенства. Он нам не нужен для разбора
                case 4:
                    result = getValueFromEquationMember(item);
            }
        });
        isCalculateResultEqualsResult(sign, digitOne, digitTwo, result);
    } else {
        console.error('Неверный формат уравнения');
    }
}

function getValueFromEquationMember(equationMember) {
    var memberValue;
    if (equationMember.classList.contains('input_member')) {
        if (isNumeric(equationMember.value)) { // Если поле input не заполнено, проставляем 0
            memberValue = parseInt(equationMember.value);
        } else {
            memberValue = 0;
        }
    } else {
        memberValue = equationMember.innerHTML.trim();
    }
    return memberValue;
}

function isNumeric(value) {
    return !isNaN(parseInt(value));
}

function isCalculateResultEqualsResult(sign, digitOne, digitTwo, result) {
    console.log('calculation: ' + calculateResult(sign, digitOne, digitTwo)); // Отладка. Удалить
    console.log('result: ' + result);
    console.log('is equal: ' + (calculateResult(sign, digitOne, digitTwo) == result));
    console.log('----------------------')
    return calculateResult(sign, digitOne, digitTwo) == result;
}

function calculateResult(sign, digitOne, digitTwo) {
    var calculationResult;
    if (isAdditionDigits(sign)) {
        calculationResult = additionDigits(digitOne, digitTwo)
    } else {
        calculationResult = subtractionDigits(digitOne, digitTwo)
    }
    return calculationResult;
}

function isAdditionDigits(sign) {
    return sign == '+';
}

function additionDigits(digitOne, digitTwo) {
    return parseInt(digitOne) + parseInt(digitTwo);
}

function subtractionDigits(digitOne, digitTwo) {
    return parseInt(digitOne) - parseInt(digitTwo);
}
