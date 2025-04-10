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
    // Handle decimal precision dynamically
const precision = Math.max(10 - Math.floor(Math.log10(Math.abs(result))), 0);
lastResult = parseFloat(result.toFixed(precision));
if (Math.abs(lastResult) >= 1e10 || Math.abs(lastResult) < 1e-6) {
  lastResult = result.toExponential(8);
}
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
    .replace(/C\((-?\d+\.?\d*),(-?\d+\.?\d*)\)/g, (match, n, r) => {
      n = Math.round(Number(n));
      r = Math.round(Number(r));
      try {
        return combination(n, r);
      } catch (e) {
        throw new Error('Invalid combination');
      }
    })
    .replace(/P\((-?\d+\.?\d*),(-?\d+\.?\d*)\)/g, (match, n, r) => {
      n = Math.round(Number(n));
      r = Math.round(Number(r));
      try {
        return permutation(n, r);
      } catch (e) {
        throw new Error('Invalid permutation');
      }
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
  if (n > 170) throw new Error('Maximum factorial is 170!');
  if (n < 0) throw new Error('Negative factorial');
  return n * factorial(n - 1);
}

// Combination function (nCr)
function combination(n, r) {
  if (n < 0 || r < 0 || !Number.isInteger(n) || !Number.isInteger(r)) throw new Error('Invalid input');
  if (r > n) throw new Error('r cannot exceed n');
  
  // Optimized calculation without large factorials
  if (r > n/2) r = n - r;
  let result = 1;
  for (let i = 1; i <= r; i++) {
    result *= (n - r + i) / i;
  }
  return parseFloat(result.toFixed(10));
}

// Permutation function (nPr)
function permutation(n, r) {
  if (n < 0 || r < 0 || !Number.isInteger(n) || !Number.isInteger(r)) throw new Error('Invalid input');
  if (r > n) throw new Error('r cannot exceed n');
  
  let result = 1;
  for (let i = n; i > n - r; i--) {
    result *= i;
  }
  return parseFloat(result.toFixed(10));
}

// Memory Functions with validation
function memoryAdd() {
  const display = document.getElementById('display');
  const value = parseFloat(display.value);
  if (isNaN(value) || !isFinite(value)) {
    display.value = 'Invalid Input';
    return;
  }
  memory = parseFloat((memory + value).toFixed(10));
}

function memorySubtract() {
  const display = document.getElementById('display');
  const value = parseFloat(display.value);
  if (isNaN(value) || !isFinite(value)) {
    display.value = 'Invalid Input';
    return;
  }
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