function convertNumber() {
    const number = document.getElementById('number').value.trim();
    const base = document.getElementById('base').value;
    
    if (number === '') {
        alert('Please enter a number.');
        return;
    }

    try {
        let decimalValue = parseInt(number, base);

        document.getElementById('decimal').textContent = `Decimal: ${decimalValue}`;
        document.getElementById('binary').textContent = `Binary: ${decimalValue.toString(2)}`;
        document.getElementById('hexadecimal').textContent = `Hexadecimal: ${decimalValue.toString(16).toUpperCase()}`;
        document.getElementById('octal').textContent = `Octal: ${decimalValue.toString(8)}`;
    } catch (error) {
        alert('Invalid number for the selected base.');
    }
}
