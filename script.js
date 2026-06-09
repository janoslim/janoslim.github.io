(() => {
  const years = document.querySelectorAll("#year");
  if (years.length) {
    years.forEach((el) => {
      el.textContent = String(new Date().getFullYear());
    });
  }
})();
