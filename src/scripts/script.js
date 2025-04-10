let memory = 0; // Memory storage for M+, M-, MR, MC
let lastResult = 0; // Store the last calculated result for "Ans"

// Append value to the display
function appendValue(value) {
  const display = document.getElementById('display');
  display.value += value;
}

// Clear the display
function clearDisplay() {
  const display = document.getElementById('display');
  display.value = '';
}

// Calculate the result
function calculate() {
  const display = document.getElementById('display');
  try {
    if (!display.value.trim()) {
      display.value = '0';
      return;
    }
    if (!isValidExpression(display.value)) {
      display.value = 'Invalid Expression';
      return;
    }
    const result = evaluateExpression(display.value);
    if (!isFinite(result)) {
      display.value = 'Math Error';
      return;
    }
    lastResult = parseFloat(result.toFixed(10)); // Limit decimal places
    display.value = lastResult;
  } catch (error) {
    display.value = 'Error';
  }
}

// Validate mathematical expression
function isValidExpression(expression) {
  // Check for balanced parentheses
  let parentheses = 0;
  for (let char of expression) {
    if (char === '(') parentheses++;
    if (char === ')') parentheses--;
    if (parentheses < 0) return false;
  }
  if (parentheses !== 0) return false;

  // Check for invalid operators sequence
  if (/[+\-*\/]{2,}/.test(expression)) return false;

  // Check for valid number format
  if (/\d*\.\d*\.\d*/.test(expression)) return false;

  return true;
}

// Evaluate mathematical expressions with advanced functions
function evaluateExpression(expression) {
  // Sanitize input
  expression = expression.replace(/\s+/g, '');

  // Replace advanced operators with JavaScript equivalents
  expression = expression
    .replace(/√\(/g, 'Math.sqrt(')
    .replace(/log\(/g, 'Math.log10(')
    .replace(/ln\(/g, 'Math.log(')
    .replace(/sin\(/g, 'Math.sin(')
    .replace(/cos\(/g, 'Math.cos(')
    .replace(/tan\(/g, 'Math.tan(')
    .replace(/(\d+)!/g, (match, n) => {
      n = Number(n);
      if (n < 0 || n > 170) throw new Error('Factorial out of range');
      return factorial(n);
    })
    .replace(/C\((\d+),(\d+)\)/g, (match, n, r) => {
      n = Number(n); r = Number(r);
      if (n < r || n < 0 || r < 0) throw new Error('Invalid combination');
      return combination(n, r);
    })
    .replace(/P\((\d+),(\d+)\)/g, (match, n, r) => {
      n = Number(n); r = Number(r);
      if (n < r || n < 0 || r < 0) throw new Error('Invalid permutation');
      return permutation(n, r);
    });

  // Evaluate and handle division by zero
  const result = Function('return ' + expression)();
  if (!isFinite(result)) throw new Error('Math Error');
  return result;
}

// Factorial function with validation
function factorial(n) {
  if (!Number.isInteger(n) || n < 0) throw new Error('Invalid factorial');
  if (n === 0 || n === 1) return 1;
  if (n > 170) throw new Error('Factorial too large');
  return n * factorial(n - 1);
}

// Combination function (nCr)
function combination(n, r) {
  return factorial(n) / (factorial(r) * factorial(n - r));
}

// Permutation function (nPr)
function permutation(n, r) {
  return factorial(n) / factorial(n - r);
}

// Memory Functions with validation
function memoryAdd() {
  const display = document.getElementById('display');
  const value = parseFloat(display.value);
  if (!isFinite(value)) return;
  memory = parseFloat((memory + value).toFixed(10));
}

function memorySubtract() {
  const display = document.getElementById('display');
  const value = parseFloat(display.value);
  if (!isFinite(value)) return;
  memory = parseFloat((memory - value).toFixed(10));
}

function memoryRecall() {
  const display = document.getElementById('display');
  display.value = memory.toString();
}

function memoryClear() {
  memory = 0;
}

// Append the last result ("Ans")
function appendAns() {
  const display = document.getElementById('display');
  display.value += lastResult;
}