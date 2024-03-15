document.addEventListener('DOMContentLoaded', (event) => {
  const searchInput = document.getElementById('searchInput');
  const rows = document.querySelectorAll('.data-row');
  searchInput.addEventListener('input', function () {
    const searchText = this.value.toLowerCase();
    rows.forEach((row) => {
      const name = row.querySelector('td:nth-child(2)').innerText.toLowerCase();
      if (name.includes(searchText)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  });
});
