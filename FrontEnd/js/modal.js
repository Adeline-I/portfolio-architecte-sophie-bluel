import { addWork, deleteWork } from "./api.js";

const modalOverlay = document.getElementById("modal-overlay");
const modalClose = document.getElementById("modal-close");
const modalBack = document.getElementById("modal-back");
const modalGallery = document.getElementById("modal-gallery");
const modalViewGallery = document.getElementById("modal-view-gallery");
const modalViewAdd = document.getElementById("modal-view-add");
const modalAddBtn = document.getElementById("modal-add-btn");

const addWorkForm = document.getElementById("add-work-form");
const imageInput = document.getElementById("image-input");
const uploadPlaceholder = document.getElementById("upload-placeholder");
const uploadZone = document.getElementById("upload-zone");
const workTitleInput = document.getElementById("work-title");
const workCategorySelect = document.getElementById("work-category");
const validateBtn = document.getElementById("modal-validate-btn");
const uploadError = document.getElementById("upload-error");
const uploadSuccess = document.getElementById("upload-success");

let works = [];
let onWorksChange = () => {};

/**
 * Initializes the modal with the current works, categories and a callback
 * to notify the main page when the works list changes.
 * @param {Array} initialWorks - The current list of works.
 * @param {Array} categories - The list of categories for the select field.
 * @param {Function} onChangeCallback - Called with the updated works array.
 */
function initModal(initialWorks, categories, onChangeCallback) {
  works = initialWorks;
  onWorksChange = onChangeCallback;
  displayCategoryOptions(categories);
}

/**
 * Renders the category <option> elements in the select field.
 * @param {Array} categories - The categories fetched from the API.
 */
function displayCategoryOptions(categories) {
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "";
  defaultOption.disabled = true;
  defaultOption.hidden = true;
  defaultOption.setAttribute("selected", "");
  workCategorySelect.appendChild(defaultOption);

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    workCategorySelect.appendChild(option);
  });
}

/**
 * Shows the "Galerie photo" view and hides the "Ajout photo" view.
 */
function showGalleryView() {
  modalViewGallery.classList.remove("hidden");
  modalViewAdd.classList.add("hidden");
  modalBack.classList.add("hidden");
}

/**
 * Shows the "Ajout photo" view and hides the "Galerie photo" view.
 */
function showAddView() {
  modalViewAdd.classList.remove("hidden");
  modalViewGallery.classList.add("hidden");
  modalBack.classList.remove("hidden");
}

/**
 * Opens the modal, always starting on the gallery view.
 */
function openModal() {
  displayModalGallery();
  showGalleryView();
  modalOverlay.classList.remove("hidden");
}

/**
 * Closes the modal and resets the add work form.
 */
function closeModal() {
  modalOverlay.classList.add("hidden");
  resetAddForm();
}

/**
 * Creates a thumbnail element (image + delete button) for a single work.
 * @param {Object} work - The work object.
 * @returns {HTMLElement} The thumbnail element.
 */
function createModalThumbnail(work) {
  const thumbnail = document.createElement("div");
  thumbnail.classList.add("modal-thumbnail");

  const img = document.createElement("img");
  img.src = work.imageUrl;
  img.alt = work.title;

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-btn", "icon-btn");
  deleteBtn.innerHTML = `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="17" height="17" rx="2" fill="black"/><path d="M6.71607 3.35558C6.82455 3.13661 7.04754 3 7.29063 3H9.70938C9.95246 3 10.1754 3.13661 10.2839 3.35558L10.4286 3.64286H12.3571C12.7127 3.64286 13 3.93013 13 4.28571C13 4.64129 12.7127 4.92857 12.3571 4.92857H4.64286C4.28728 4.92857 4 4.64129 4 4.28571C4 3.93013 4.28728 3.64286 4.64286 3.64286H6.57143L6.71607 3.35558ZM4.64286 5.57143H12.3571V12C12.3571 12.7092 11.7806 13.2857 11.0714 13.2857H5.92857C5.21942 13.2857 4.64286 12.7092 4.64286 12V5.57143ZM6.57143 6.85714C6.39464 6.85714 6.25 7.00179 6.25 7.17857V11.6786C6.25 11.8554 6.39464 12 6.57143 12C6.74821 12 6.89286 11.8554 6.89286 11.6786V7.17857C6.89286 7.00179 6.74821 6.85714 6.57143 6.85714ZM8.5 6.85714C8.32321 6.85714 8.17857 7.00179 8.17857 7.17857V11.6786C8.17857 11.8554 8.32321 12 8.5 12C8.67679 12 8.82143 11.8554 8.82143 11.6786V7.17857C8.82143 7.00179 8.67679 6.85714 8.5 6.85714ZM10.4286 6.85714C10.2518 6.85714 10.1071 7.00179 10.1071 7.17857V11.6786C10.1071 11.8554 10.2518 12 10.4286 12C10.6054 12 10.75 11.8554 10.75 11.6786V7.17857C10.75 7.00179 10.6054 6.85714 10.4286 6.85714Z" fill="white"/></svg>`;
  deleteBtn.setAttribute("aria-label", "Supprimer");
  deleteBtn.addEventListener("click", () =>
    handleDeleteWork(work.id, thumbnail),
  );

  thumbnail.appendChild(img);
  thumbnail.appendChild(deleteBtn);

  return thumbnail;
}

/**
 * Clears and renders the modal gallery grid from the current works array.
 */
function displayModalGallery() {
  modalGallery.innerHTML = "";
  works.forEach((work) => {
    modalGallery.appendChild(createModalThumbnail(work));
  });
}

/**
 * Deletes a work via the API, then updates the modal grid and notifies main.js.
 * @param {number} id - The id of the work to delete.
 * @param {HTMLElement} thumbnailElement - The thumbnail element to remove from the DOM.
 */
async function handleDeleteWork(id, thumbnailElement) {
  try {
    const token = sessionStorage.getItem("token");
    await deleteWork(id, token);

    works = works.filter((work) => work.id !== id);
    thumbnailElement.remove();
    onWorksChange(works);
  } catch (error) {
    console.error(error);
  }
}

/**
 * Displays the selected image as a preview in the upload zone.
 * @param {File} file - The selected image file.
 */
function displayImagePreview(file) {
  const preview = document.createElement("img");
  preview.classList.add("upload-preview");
  preview.src = URL.createObjectURL(file);
  preview.alt = "";

  uploadZone.appendChild(preview);
  uploadPlaceholder.classList.add("hidden");
}

/**
 * Handles the image input change: validates the file size and shows a preview,
 * or displays an error message if the file is too large.
 */
function handleImageChange() {
  const file = imageInput.files[0];
  if (!file) {
    return;
  }

  uploadSuccess.classList.add("hidden");

  const allowedTypes = ["image/jpeg", "image/png"];
  if (!allowedTypes.includes(file.type)) {
    uploadError.textContent = "Seuls les fichiers jpg et png sont acceptés.";
    uploadError.classList.remove("hidden");
    imageInput.value = "";
    return;
  }

  const maxSize = 4 * 1024 * 1024;
  if (file.size > maxSize) {
    uploadError.textContent = "L'image ne doit pas dépasser 4 Mo.";
    uploadError.classList.remove("hidden");
    imageInput.value = "";
    return;
  }

  uploadError.classList.add("hidden");
  displayImagePreview(file);
  checkFormValidity();
}

/**
 * Enables the validate button only if image, title and category are all filled.
 */
function checkFormValidity() {
  const hasImage = imageInput.files.length > 0;
  const hasTitle = workTitleInput.value.trim() !== "";
  const hasCategory = workCategorySelect.value !== "";

  validateBtn.disabled = !(hasImage && hasTitle && hasCategory);
}

/**
 * Resets the add work form to its initial empty state.
 */
function resetAddForm() {
  addWorkForm.reset();

  const existingPreview = uploadZone.querySelector(".upload-preview");
  if (existingPreview) {
    existingPreview.remove();
  }

  uploadPlaceholder.classList.remove("hidden");
  uploadError.classList.add("hidden");
  uploadSuccess.classList.add("hidden");
  validateBtn.disabled = true;
}

/**
 * Handles the add work form submission: sends the FormData to the API,
 * updates the galleries, resets the form, and returns to the gallery view.
 * @param {SubmitEvent} event - The form submit event.
 */
async function handleAddWork(event) {
  event.preventDefault();

  try {
    const token = sessionStorage.getItem("token");
    const formData = new FormData(addWorkForm);
    const newWork = await addWork(formData, token);

    works.push(newWork);
    modalGallery.appendChild(createModalThumbnail(newWork));
    onWorksChange(works);

    resetAddForm();
    uploadSuccess.classList.remove("hidden");
  } catch (error) {
    console.error(error);
    uploadError.textContent = "Une erreur est survenue, veuillez réessayer.";
    uploadError.classList.remove("hidden");
  }
}

modalClose.addEventListener("click", closeModal);

modalOverlay.addEventListener("click", (event) => {
  if (event.target === modalOverlay) {
    closeModal();
  }
});

modalAddBtn.addEventListener("click", showAddView);
modalBack.addEventListener("click", showGalleryView);

imageInput.addEventListener("change", handleImageChange);
workTitleInput.addEventListener("input", checkFormValidity);
workCategorySelect.addEventListener("change", checkFormValidity);
addWorkForm.addEventListener("submit", handleAddWork);

export { initModal, openModal };
