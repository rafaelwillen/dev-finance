const Modal = {
  toggle() {
    document.querySelector(".modal-overlay").classList.toggle("active");
  },
};

const LocalStorage = {
  get() {
    return JSON.parse(localStorage.getItem("devFinance.Transactions")) || [];
  },
  set(transactions) {
    localStorage.setItem(
      "devFinance.Transactions",
      JSON.stringify(transactions)
    );
  },
};

const Transaction = {
  all: LocalStorage.get(),
  incomes() {
    return Transaction.all.reduce((prev, curr) => {
      if (curr.value > 0) prev += curr.value;
      return prev;
    }, 0);
  },
  expenses() {
    return Transaction.all.reduce((prev, curr) => {
      if (curr.value < 0) prev += curr.value;
      return prev;
    }, 0);
  },
  total() {
    return this.incomes() + this.expenses();
  },
  add(transaction) {
    this.all.push(transaction);
    LocalStorage.set(this.all);
    App.update();
  },
  remove(index) {
    this.all.splice(index, 1);
    LocalStorage.set(this.all);
    App.update();
  },
};

const Utility = {
  formatCurrency(value) {
    const sign = Number(value) < 0 ? "-" : "";
    value = String(value).replace(/\D/g, "");
    value = Number(value) / 100;
    value = value.toLocaleString("pt-ao", {
      style: "currency",
      currency: "AOA",
    });
    return sign + value;
  },
  formatValue(value) {
    return value * 100;
  },
  formatDate(date) {
    date = String(date).split("-");
    return date.reverse().join("/");
  },
};

const DOM = {
  transactionsTable: document.querySelector("#transactions-table tbody"),
  updateCards() {
    income = Transaction.incomes();
    expense = Transaction.expenses();
    total = Transaction.total();
    document.querySelector("#income-display").innerHTML =
      Utility.formatCurrency(income);
    document.querySelector("#expense-display").innerHTML =
      Utility.formatCurrency(expense);
    document.querySelector("#total-display").innerHTML =
      Utility.formatCurrency(total);
  },
  tableRowHTML(transaction, index) {
    const cssClass = transaction.value > 0 ? "income" : "expense";
    const amount = Utility.formatCurrency(transaction.value);
    const html = ` <td class="description">${transaction.description}</td>
        <td class="${cssClass}">${amount}</td>
        <td class="data">${transaction.date}</td>
        <td><img onClick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover Transação"/></td>
      `;
    return html;
  },
  addTransactionToTable(transaction, index) {
    const row = document.createElement("tr");
    row.innerHTML = DOM.tableRowHTML(transaction, index);
    DOM.transactionsTable.appendChild(row);
  },
  clearTable() {
    this.transactionsTable.innerHTML = "";
  },
};

const Form = {
  descriptionInput: document.querySelector("form #description-input"),
  valueInput: document.querySelector("form #value-input"),
  dateInput: document.querySelector("form #date-input"),
  process() {
    try {
      this.validate(this.getValues());
      const transaction = this.formatValues(this.getValues());
      Transaction.add(transaction);
      this.clearFields();
      Modal.toggle();
    } catch (e) {
      alert(e.message);
    }
  },
  getValues() {
    return {
      description: Form.descriptionInput.value.trim(),
      value: Form.valueInput.value.trim(),
      date: Form.dateInput.value.trim(),
    };
  },
  validate({ description, value, date }) {
    if (description == "" || value == "" || date == "")
      throw new Error("Preencha todos os campos");
  },
  formatValues(values) {
    values.value = Utility.formatValue(values.value);
    values.date = Utility.formatDate(values.date);
    return values;
  },
  clearFields() {
    this.descriptionInput.value = "";
    this.valueInput.value = "";
    this.dateInput.value = "";
  },
};

const App = {
  init() {
    DOM.updateCards();
    Transaction.all.forEach(DOM.addTransactionToTable);
  },
  update() {
    DOM.clearTable();
    this.init();
  },
};

// An IIFE. Runs the function immediately
(() => {
  document.querySelector("button.add").onclick = Modal.toggle;
  document.querySelector("form button.cancel").onclick = (e) => {
    e.preventDefault();
    Modal.toggle();
  };
  document.forms[0].onsubmit = (e) => {
    e.preventDefault();
    Form.process();
  };
  App.init();
})();
