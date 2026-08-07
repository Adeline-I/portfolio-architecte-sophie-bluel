const adminBanner = document.querySelector(".admin-banner");
const editLink = document.querySelector(".edit-link");
const filters = document.querySelector(".filters");
const navAuth = document.getElementById("nav-auth");

/**
 * Logs the user out: clears the token and reloads the page in logged-out state.
 * @param {Event} event - The click event.
 */
function handleLogout(event) {
  event.preventDefault();
  sessionStorage.removeItem("token");
  window.location.reload();
}

/**
 * Switches the page to admin mode: shows the banner and edit link,
 * hides the filters, and replaces "login" with "logout" in the nav.
 */
function enableAdminMode() {
  adminBanner.classList.remove("hidden");
  editLink.classList.remove("hidden");
  filters.classList.add("hidden");

  navAuth.innerHTML = "";
  const logoutLink = document.createElement("a");
  logoutLink.href = "#";
  logoutLink.textContent = "logout";
  logoutLink.addEventListener("click", handleLogout);
  navAuth.appendChild(logoutLink);
}

export { enableAdminMode };
