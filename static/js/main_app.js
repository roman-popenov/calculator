$(document).ready(main);

function main() {
    // If we do not set the request as synchronous, then some values will be undefined and not update with the results
    $.ajaxSetup({
        async: false
    });

    // Constants
    const MAX_DIGIT_COUNT = 13
    const SMALLEST_VALUE = 1e-99
    const ZERO = '0'
    const OVERFLOW_MESSAGE = 'OVERFLOW'
    const ERROR_MESSAGE = 'ERROR'


    // Operators
    const DECIMAL_DOT = '.'
    const PERCENT_OPERATOR = "%"
    const NEGATE_OPERATOR = 'neg'

    // Resource paths
    const PERFORM_CALCULATE_PATH = '/_calculate'

    // Inputs from the web-page widget
    let mainScreen = $('#output');
    let last_selected_operator = '';
    let fist_value = true;

    // Data to send to the Flask calculator backend app
    let number_array = []
    let operator_array = []

    // Wire the clicks to behaviors
    $('.nums').click(handleNumbersClick());
    $('#clearButton').click(handleClearClick());
    $('.btn-operate').click(handleOperatorClick());
    $('#resultButton').click(handleEqualsButtonClick());

    // Function to handle the buttons representing number and the +/- (negative) sign
    function handleNumbersClick() {
        return function () {
            // Nothing to do if the user accidentally already entered a very large number and caused and overflow
            if (isInvalidState()) {
                return;
            }

            let currentEnteredValue = $(this).val();
            let currentDisplayedValue = getMainScreenValue();
            let valueToDisplay;
            currentDisplayedValue = processNumberPostOperation(currentDisplayedValue);

            // Check if the user is trying to toggle a decimal number:
            //  1. If the user did not enter any numbers yet, and the screen display ZERO - allow the user to toggle decimal
            //  2. If the user has a whole number entered simply append the decimal symbol, otherwise it's a no-op
            if (currentEnteredValue === DECIMAL_DOT) {
                if (currentDisplayedValue === '0,') {
                    valueToDisplay = ZERO;
                } else if (currentDisplayedValue.indexOf(DECIMAL_DOT) === -1) {
                    valueToDisplay = currentDisplayedValue.concat(DECIMAL_DOT);
                } else {
                    return;
                }
            } else if (currentEnteredValue === NEGATE_OPERATOR) {
                valueToDisplay = setNegativeSign(currentDisplayedValue, valueToDisplay);
            } else {
                // Here, the user passed a simple digit from 0 to 0
                // If the screen is displaying anything but zero, append the selected digit to the end, otherwise display 0
                if (currentDisplayedValue !== ZERO && !fist_value) {
                    valueToDisplay = currentDisplayedValue.concat(currentEnteredValue);
                } else {
                    valueToDisplay = currentEnteredValue;
                }

                if (fist_value) {
                    fist_value = false;
                }
            }

            if (valueToDisplay.length > MAX_DIGIT_COUNT) {
                valueToDisplay = OVERFLOW_MESSAGE;
            }

            // Display the value on the screen
            if (valueToDisplay) {
                writeToMainScreen(valueToDisplay);
            }
        };
    }

    // Function to handle a click on the Operator click (+, -, * or /)
    function handleOperatorClick() {
        return function () {
            // Nothing to do if the screen is displaying an overflow or an error
            if (isInvalidState()) {
                return;
            }

            let valueToDisplay;
            let selectedOperator = $(this).val();
            let currentDisplayedValue = getMainScreenValue();

            if (selectedOperator === PERCENT_OPERATOR) {
                valueToDisplay = calculatePercentOperation(currentDisplayedValue);
            } else {
                if (last_selected_operator === '') {
                    number_array.push(currentDisplayedValue)
                }
                last_selected_operator = selectedOperator
            }

            // Verify that no overflow on the screen has occurred
            if (typeof valueToDisplay !== 'undefined' && valueToDisplay.length > MAX_DIGIT_COUNT) {
                valueToDisplay = OVERFLOW_MESSAGE;
            }

            // If the value is too small, simply display is a zero
            if (valueToDisplay <= SMALLEST_VALUE) {
                valueToDisplay = ZERO
            }

            // Display the value if there is one to display
            if (valueToDisplay) {
                writeToMainScreen(valueToDisplay);
            }
        };
    }

    // Function to handle the case when the user wants to obtain the result
    function handleEqualsButtonClick() {
        return function () {
            // Nothing to do if the user accidentally already entered a very large number and caused and overflow
            if (isInvalidState()) {
                return;
            }

            let valueToDisplay = null;
            let currentDisplayedValue = getMainScreenValue();

            // User has not selected any operations yet
            if (!operator_array.length) {
                return;
            }

            if (currentDisplayedValue) {
                number_array.push(currentDisplayedValue)
            }

            $.getJSON($SCRIPT_ROOT + PERFORM_CALCULATE_PATH, {
                numbers: JSON.stringify(number_array),
                operators: JSON.stringify(operator_array)
            }, function (data) {
                if (data.result.toString().length > MAX_DIGIT_COUNT) {
                    writeToMainScreen(OVERFLOW_MESSAGE);
                } else {
                    // We can do this here because getJSON is executed synchronously because async: false
                    valueToDisplay = data.result;
                    clearData();
                }
            });


            if (valueToDisplay) {
                writeToMainScreen(valueToDisplay);
            }
        };
    }

    // Function to handle reset (C) button
    function handleClearClick() {
        return function () {
            clearMainScreen()
            clearData();
        };
    }

    // Function to ensure that the value resets the main display if operator was selected previously and a number is
    //  entered. The previously entered operator is pushed to the operator array and it's reset until next operation
    function processNumberPostOperation(currentDisplayedValue) {
        if (last_selected_operator !== '') {
            operator_array.push(last_selected_operator)
            last_selected_operator = ''
            currentDisplayedValue = ZERO
        }
        return currentDisplayedValue;
    }

    // Function to toggle the minus sign on the display. Since we do not have a special placeholder on the screen for
    //  negative signs, it can cause an overflow on the display
    function setNegativeSign(currentDisplayedValue, valueToDisplay) {
        if (currentDisplayedValue !== '0,' && currentDisplayedValue !== '0' && (currentDisplayedValue.indexOf('-') === -1)) {
            valueToDisplay = '-'.concat(currentDisplayedValue);
        } else if (currentDisplayedValue.indexOf('-') !== -1) {
            valueToDisplay = currentDisplayedValue.replace('-', '');
        }
        return valueToDisplay;
    }

    // The percent operation is not queued up as a normal operator. This is a limitation of the current implementation
    // as since the implementation on the backend receives an array of numbers and operators and interleaves them as so:
    // [1,2,3] and [+,+] -> 1+2+3; that string is then evaluated as a simple math operation. it would make little sense
    // to get a percentage on a value that is not yet calculated since % is not considered as a simple math operator.
    function calculatePercentOperation(currentDisplayedValue) {
        return operator_array.length === 0 ? Number(currentDisplayedValue) / 100 : ERROR_MESSAGE;
    }

    // Reset all the data whenever the button C (clear) is called
    function clearData() {
        fist_value = true;
        last_selected_operator = '';
        operator_array = [];
        number_array = [];
    }

    function getMainScreenValue() {
        return mainScreen.html()
    }

    function clearMainScreen() {
        zeroOutMainScreen();
    }

    function zeroOutMainScreen() {
        writeToMainScreen(ZERO);
    }

    function maximumDigitLengthReached() {
        writeToMainScreen(OVERFLOW_MESSAGE);
    }

    function writeToMainScreen(valueToWrite) {
        mainScreen.html(valueToWrite);
    }

    // Checks if currently displayed value displays an overflow or error message
    function isInvalidState() {
        return mainScreen.html() === OVERFLOW_MESSAGE || mainScreen.html() === ERROR_MESSAGE;
    }
}
