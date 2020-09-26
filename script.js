const transactionUL = document.querySelector('#transactions');
const incomeDisplay = document.querySelector('#money-plus');
const expenseDisplay = document.querySelector('#money-minus');
const balanceDisplay = document.querySelector('#balance');
const form = document.querySelector('#form');
const inputTransactionName = document.querySelector('#text');
const inputTransactionAmont = document.querySelector('#amount');

const localStorageTransactions = JSON.parse(
  localStorage.getItem('transactions'),
);
let transactions =
  localStorage.getItem('transactions') !== null ? localStorageTransactions : [];
const removeTransaction = (id) => {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  updateLocalStorage();
  init();
};
const addTransactioIntoDom = ({ amount, name, id }) => {
  const operator = amount < 0 ? '-' : '+';
  const CSSClass = amount < 0 ? 'minus' : 'plus';
  const amountWithOutOperator = Math.abs(amount);
  const li = document.createElement('li');

  li.classList.add(CSSClass);
  li.innerHTML = `${name} <span>${operator}${amountWithOutOperator}</span><button class="delete-btn" onClick="removeTransaction(${id})">x</button>`;
  transactionUL.append(li);
};
const getExpenses = (transactionsAmounts) =>
  Math.abs(
    transactionsAmounts
      .filter((item) => item < 0)
      .reduce((accu, item) => accu + item, 0),
  ).toFixed(2);

const getIncome = (transactionsAmounts) =>
  transactionsAmounts
    .filter((item) => item > 0)
    .reduce((accu, value) => accu + value, 0)
    .toFixed(2);
const getTotal = (transactionsAmounts) =>
  transactionsAmounts
    .reduce((accu, transaction) => accu + transaction, 0)
    .toFixed(2);
const updateBalanceValues = () => {
  const transactionsAmounts = transactions.map(({ amount }) => amount);

  const total = getTotal(transactionsAmounts);

  const income = getIncome(transactionsAmounts);
  const expense = getExpenses(transactionsAmounts);

  balanceDisplay.textContent = `R$${total}`;
  incomeDisplay.textContent = `R$ ${income}`;
  expenseDisplay.textContent = `R$ ${expense}`;
};

const init = () => {
  transactionUL.innerHTML = '';
  transactions.forEach(addTransactioIntoDom);
  updateBalanceValues();
};
init();

const updateLocalStorage = () => {
  localStorage.setItem('transactions', JSON.stringify(transactions));
};

const generateId = () => Math.round(Math.random() * 1000);
const addToTransationArray = (transactionName, transactionAmount) => {
  transactions.push({
    id: generateId(),
    name: transactionName,
    amount: Number(transactionAmount),
  });
};
const cleanInputs = () => {
  inputTransactionAmont.value = '';
  inputTransactionName.value = '';
};
const handleFormSubmit = (event) => {
  event.preventDefault();

  const transactionName = inputTransactionName.value.trim();
  const transactionAmount = inputTransactionAmont.value.trim();
  const isSomeInputEmpty = transactionAmount === '' || transactionName == '';
  if (isSomeInputEmpty) {
    alert('Todos os campos devem ser preenchidos !');
    return;
  }
  addToTransationArray(transactionName, transactionAmount);

  init();
  updateLocalStorage();
  cleanInputs();
};

form.addEventListener('submit', handleFormSubmit);
