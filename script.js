const Modal = {
  toggle() {
    document.querySelector(".modal-overlay").classList.toggle("active");
  },
};

const Transaction = {
  all: [
    {
      description: "App",
      value: 1000000,
      date: "26/08/2021",
    },
    {
      description: "Laptop",
      value: -100000,
      date: "27/08/2021",
    },
  ],
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
};

const Utility = {
  formatCurrency(value) {
    const sign = Number(value) < 0 ? "-" : "";
    value = String(value).replace(/\D/g, "");
    value = Number(value) / 100;
    value = value.toLocaleString("pt-ao", {
      style: "currency",
      currency: "KZs",
    });
    return sign + value;
  },
};
// An IIFE. Runs the function immediately
(() => {
  document.querySelector("button.add").onclick = Modal.toggle;
  document.querySelector("form button.cancel").onclick = (e) => {
    e.preventDefault();
    Modal.toggle();
  };
})();

console.log(Utility.formatCurrency(Transaction.total()));
