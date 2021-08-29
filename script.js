const Modal = {
  toggle() {
    document.querySelector(".modal-overlay").classList.toggle("active");
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
