import { addWork } from "./api.js";
import { addThumbnailToModal } from "./modal.js";

const modalOverlay = document.getElementById("modal-overlay");
const modalClose = document.getElementById("modal-close");
const modalBack = document.getElementById("modal-back");

const addWorkForm = document.getElementById("add-work-form");
const imageInput = document.getElementById("image-input");
const uploadPlaceholder = document.getElementById("upload-placeholder");
const uploadZone = document.getElementById("upload-zone");
const workTitleInput = document.getElementById("work-title");
const workCategorySelect = document.getElementById("work-category");
const validateBtn = document.getElementById("modal-validate-btn");
const uploadError = document.getElementById("upload-error");
const uploadSuccess = document.getElementById("upload-success");

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
 * Displays an error message in the upload zone.
 * @param {string} message - The error message to display.
 */
function showUploadError(message) {
  uploadError.textContent = message;
  uploadError.classList.remove("hidden");
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
 * Handles the image input change: validates the file type and size and
 * shows a preview, or displays an error message if invalid.
 */
function handleImageChange() {
  const file = imageInput.files[0];
  if (!file) {
    return;
  }

  uploadSuccess.classList.add("hidden");

  const allowedTypes = ["image/jpeg", "image/png"];
  if (!allowedTypes.includes(file.type)) {
    showUploadError("Seuls les fichiers jpg et png sont acceptés.");
    imageInput.value = "";
    return;
  }

  const maxSize = 4 * 1024 * 1024;
  if (file.size > maxSize) {
    showUploadError("L'image ne doit pas dépasser 4 Mo.");
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
 * hands the new work to modal.js, resets the form.
 * @param {SubmitEvent} event - The form submit event.
 */
async function handleAddWork(event) {
  event.preventDefault();

  try {
    const token = sessionStorage.getItem("token");
    const formData = new FormData(addWorkForm);
    const newWork = await addWork(formData, token);

    addThumbnailToModal(newWork);

    resetAddForm();
    uploadSuccess.classList.remove("hidden");
  } catch (error) {
    console.error(error);
    showUploadError("Une erreur est survenue, veuillez réessayer.");
  }
}

modalClose.addEventListener("click", resetAddForm);
modalOverlay.addEventListener("click", (event) => {
  if (event.target === modalOverlay) {
    resetAddForm();
  }
});
modalBack.addEventListener("click", resetAddForm);

imageInput.addEventListener("change", handleImageChange);
workTitleInput.addEventListener("input", checkFormValidity);
workCategorySelect.addEventListener("change", checkFormValidity);
addWorkForm.addEventListener("submit", handleAddWork);

export { displayCategoryOptions };
