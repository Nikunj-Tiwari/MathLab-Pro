/**
 * Mathematical Function: Converts a decimal number to a string in a given base.
 * Handles both integer and fractional parts using the multiplication method.
 */
function convertDecimalToBase(num, base) {
    if (isNaN(num)) return "NaN";

    // 1. Separate parts
    let integerPart = Math.floor(Math.abs(num));
    let fractionalPart = Math.abs(num) - integerPart;

    // 2. Convert integer part
    let intStr = integerPart.toString(base).toUpperCase();

    // 3. Convert fractional part using multiplication method
    let fracStr = "";
    let precision = 12;

    while (fractionalPart > 0 && precision > 0) {
        fractionalPart *= base;
        let digit = Math.floor(fractionalPart);
        fracStr += digit.toString(base).toUpperCase();
        fractionalPart -= digit;
        precision--;
    }

    // 4. Combine
    let finalBaseStr = fracStr.length > 0 ? intStr + "." + fracStr : intStr;
    return (num < 0 ? "-" : "") + finalBaseStr;
}

/**
 * UI Controller: Reads input and updates the results section.
 */
async function convertNumber() {
    const numInput = document.getElementById('number');
    const sourceBaseSelect = document.getElementById('base');
    const sourceBase = parseInt(sourceBaseSelect.value);
    const inputValue = numInput.value.trim();

    const btn = document.getElementById('calcBtn');
    const card = document.getElementById('resultCard');

    if (!inputValue) {
        alert("Please enter a number.");
        return;
    }

    // Loading State
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Converting...';
    card.classList.remove('visible');

    await new Promise(r => setTimeout(r, 400));

    try {
        let decimalValue;

        // Use parseFloat for decimal as requested
        if (sourceBase === 10) {
            decimalValue = parseFloat(inputValue);
        } else {
            // For other bases, we still need to parse non-base10 floats manually
            const parts = inputValue.split('.');
            decimalValue = parseInt(parts[0], sourceBase);
            if (parts.length > 1) {
                let fracPart = 0;
                for (let i = 0; i < parts[1].length; i++) {
                    const digit = parseInt(parts[1][i], sourceBase);
                    if (isNaN(digit)) throw new Error("Invalid character for base");
                    fracPart += digit * Math.pow(sourceBase, -(i + 1));
                }
                decimalValue += fracPart;
            }
        }

        if (isNaN(decimalValue)) {
            throw new Error("Invalid Input");
        }

        // Update UI
        document.getElementById('decimal').textContent = decimalValue.toString();
        document.getElementById('binary').textContent = convertDecimalToBase(decimalValue, 2);
        document.getElementById('octal').textContent = convertDecimalToBase(decimalValue, 8);
        document.getElementById('hexadecimal').textContent = convertDecimalToBase(decimalValue, 16);

        card.classList.add('visible');
    } catch (e) {
        alert("Error: " + e.message);
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-exchange-alt"></i> Convert Now';
    }
}
