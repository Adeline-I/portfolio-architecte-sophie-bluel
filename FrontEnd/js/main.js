import { getCategories, getWorks } from "./api.js";
import { initModal, openModal } from "./modal.js";

const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");
const adminBanner = document.querySelector(".admin-banner");
const editLink = document.querySelector(".edit-link");
const navAuth = document.getElementById("nav-auth");

let allWorks = [];

/**
 * Creates a <figure> element for a single work.
 * @param {Object} work - The work object (id, title, imageUrl, categoryId...).
 * @returns {HTMLElement} The figure element ready to be appended to the gallery.
 */
function createWorkElement(work) {
  const figure = document.createElement("figure");

  const img = document.createElement("img");
  img.src = work.imageUrl;
  img.alt = work.title;

  const figcaption = document.createElement("figcaption");
  figcaption.textContent = work.title;

  figure.appendChild(img);
  figure.appendChild(figcaption);

  return figure;
}

/**
 * Clears the gallery and renders the given list of works.
 * @param {Array} works - The works to display.
 */
function displayWorks(works) {
  gallery.innerHTML = "";
  works.forEach((work) => {
    gallery.appendChild(createWorkElement(work));
  });
}

/**
 * Filters the works array by category id.
 * @param {number|string} categoryId - The category id to filter by, or "all" for no filter.
 * @returns {Array} The filtered array of works.
 */
function filterWorks(categoryId) {
  if (categoryId === "all") {
    return allWorks;
  }
  return allWorks.filter((work) => work.categoryId === categoryId);
}

/**
 * Sets the clicked filter button as active and removes the active state from others.
 * @param {HTMLElement} clickedButton - The button that was clicked.
 */
function setActiveButton(clickedButton) {
  const buttons = filters.querySelectorAll(".filter-btn");
  buttons.forEach((button) => button.classList.remove("active"));
  clickedButton.classList.add("active");
}

/**
 * Creates a single filter button with its click behavior.
 * @param {string} label - The text displayed on the button.
 * @param {number|string} categoryId - The category id used to filter works on click.
 * @returns {HTMLElement} The button element ready to be appended to the filters container.
 */
function createFilterButton(label, categoryId) {
  const button = document.createElement("button");
  button.classList.add("filter-btn");
  button.textContent = label;

  button.addEventListener("click", () => {
    setActiveButton(button);
    const filteredWorks = filterWorks(categoryId);
    displayWorks(filteredWorks);
  });

  return button;
}

/**
 * Renders the "Tous" button plus one button per category.
 * @param {Array} categories - The categories fetched from the API.
 */
function displayFilters(categories) {
  filters.innerHTML = "";

  const allButton = createFilterButton("Tous", "all");
  allButton.classList.add("active");
  filters.appendChild(allButton);

  categories.forEach((category) => {
    const button = createFilterButton(category.name, category.id);
    filters.appendChild(button);
  });
}

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

/**
 * Fetches works and categories in parallel, then renders the gallery,
 * and switches to admin mode if a token is present.
 */
async function init() {
  try {
    const [works, categories] = await Promise.all([
      getWorks(),
      getCategories(),
    ]);

    allWorks = works;
    displayWorks(allWorks);

    initModal(allWorks, (updatedWorks) => {
      allWorks = updatedWorks;
      displayWorks(allWorks);
    });

    const token = sessionStorage.getItem("token");
    if (token) {
      enableAdminMode();
    } else {
      displayFilters(categories);
    }
  } catch (error) {
    console.error(error);
  }
}

editLink.addEventListener("click", (event) => {
  event.preventDefault();
  openModal();
});

init();
