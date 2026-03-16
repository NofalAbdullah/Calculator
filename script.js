let current = '0';
let prev = null;
let op = null;
let justCalc = false;

const resultEl = document.getElementById('result');
const exprEl = document.getElementById('expression');

function update() {
  resultEl.textContent = current.length > 12 ? parseFloat(current).toPrecision(8) : current;
}

function flash() {
  resultEl.classList.add('flash');
  setTimeout(() => resultEl.classList.remove('flash'), 200);
}

function num(n) {
  if (justCalc) { current = n; justCalc = false; }
  else if (current === '0') current = n;
  else if (current.length < 12) current += n;
  update();
}

function dot() {
  if (justCalc) { current = '0.'; justCalc = false; }
  else if (!current.includes('.')) current += '.';
  update();
}

function setOp(o) {
  if (op && !justCalc) calculate(true);
  prev = parseFloat(current);
  op = o;
  justCalc = true;
  const symbols = { '/': '÷', '*': '×', '-': '−', '+': '+' };
  exprEl.textContent = `${prev} ${symbols[o]}`;
}

function calculate(silent = false) {
  if (op === null || prev === null) return;
  const a = prev, b = parseFloat(current);
  const symbols = { '/': '÷', '*': '×', '-': '−', '+': '+' };
  if (!silent) exprEl.textContent = `${a} ${symbols[op]} ${b} =`;
  let res;
  switch (op) {
    case '+': res = a + b; break;
    case '-': res = a - b; break;
    case '*': res = a * b; break;
    case '/': res = b === 0 ? 'Error' : a / b; break;
  }
  current = res === 'Error' ? 'Error' : String(parseFloat(res.toFixed(10)));
  op = null; prev = null; justCalc = true;
  if (!silent) flash();
  update();
}

function clearAll() {
  current = '0'; prev = null; op = null; justCalc = false;
  exprEl.textContent = '';
  update();
}

function toggleSign() {
  if (current !== '0' && current !== 'Error') {
    current = current.startsWith('-') ? current.slice(1) : '-' + current;
    update();
  }
}

function percent() {
  if (current !== 'Error') {
    current = String(parseFloat(current) / 100);
    update();
  }
}

document.addEventListener('keydown', e => {
  if (e.key >= '0' && e.key <= '9') num(e.key);
  else if (e.key === '.') dot();
  else if (e.key === '+') setOp('+');
  else if (e.key === '-') setOp('-');
  else if (e.key === '*') setOp('*');
  else if (e.key === '/') { e.preventDefault(); setOp('/'); }
  else if (e.key === 'Enter' || e.key === '=') calculate();
  else if (e.key === 'Escape') clearAll();
  else if (e.key === 'Backspace') {
    if (current.length > 1) current = current.slice(0, -1);
    else current = '0';
    update();
  }
});
