import { enableAdminMode } from "./admin.js";
import { getCategories, getWorks } from "./api.js";
import { displayFilters, displayWorks } from "./gallery.js";
import { displayCategoryOptions } from "./modal-form.js";
import { initModal, openModal } from "./modal.js";

const editLink = document.querySelector(".edit-link");

/**
 * Fetches works and categories in parallel, renders the gallery,
 * and switches to admin mode or shows filters depending on the token.
 */
async function init() {
  try {
    const [works, categories] = await Promise.all([
      getWorks(),
      getCategories(),
    ]);

    displayWorks(works);
    displayCategoryOptions(categories);

    initModal(works, (updatedWorks) => {
      displayWorks(updatedWorks);
    });

    const token = sessionStorage.getItem("token");
    if (token) {
      enableAdminMode();
    } else {
      displayFilters(categories, works);
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
