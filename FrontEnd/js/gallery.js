const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");

let currentWorks = [];

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
 * Filters the stored works array by category id.
 * @param {number|string} categoryId - The category id to filter by, or "all" for no filter.
 * @returns {Array} The filtered array of works.
 */
function filterWorks(categoryId) {
  if (categoryId === "all") {
    return currentWorks;
  }
  return currentWorks.filter((work) => work.categoryId === categoryId);
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
    displayWorks(filterWorks(categoryId));
  });

  return button;
}

/**
 * Stores the works for filtering, then renders the "Tous" button
 * plus one button per category.
 * @param {Array} categories - The categories fetched from the API.
 * @param {Array} works - The full list of works, used as the filtering source.
 */
function displayFilters(categories, works) {
  currentWorks = works;
  filters.innerHTML = "";

  const allButton = createFilterButton("Tous", "all");
  allButton.classList.add("active");
  filters.appendChild(allButton);

  categories.forEach((category) => {
    const button = createFilterButton(category.name, category.id);
    filters.appendChild(button);
  });
}

export { displayFilters, displayWorks };
