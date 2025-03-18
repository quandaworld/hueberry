const userMenuButton = document.getElementById("user-menu-button");
const userDropdown = document.getElementById("user-dropdown");

// Functionality for the user dropdown menu
userMenuButton.addEventListener("click", function () {
  if (userDropdown.style.display === "none") {
    userDropdown.style.display = "block";
  } else {
    userDropdown.style.display = "none";
  }
});

// Close the dropdown if the user clicks outside of it
document.querySelectorAll(".asset-card").forEach((card) => {
  card.addEventListener("click", function () {
    const link = this.querySelector("a").getAttribute("href");
    window.location.href = link;
  });
});
