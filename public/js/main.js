document.getElementById('user-menu-button').addEventListener('click', function() {
  const dropdown = document.getElementById('user-dropdown');
  if (dropdown.style.display === 'none') {
    dropdown.style.display = 'block';
  } else {
    dropdown.style.display = 'none';
  }
});

document.querySelectorAll('.asset-card').forEach(card => {
  card.addEventListener('click', function() {
    const link = this.querySelector('a').getAttribute('href');
    window.location.href = link;
  });
});
