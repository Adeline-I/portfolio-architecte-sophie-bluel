const API_URL = "http://localhost:5678/api";

/**
 * Fetches all works from the API.
 * @returns {Promise<Array>} An array of work objects.
 */
async function getWorks() {
  const response = await fetch(`${API_URL}/works`);
  if (!response.ok) {
    throw new Error("Failed to fetch works");
  }
  return response.json();
}

/**
 * Fetches all categories from the API.
 * @returns {Promise<Array>} An array of category objects.
 */
async function getCategories() {
  const response = await fetch(`${API_URL}/categories`);
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json();
}

/**
 * Logs in a user with email and password against the API.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<Object>} An object containing userId and token.
 */
async function login(email, password) {
  const response = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Invalid credentials");
  }

  return response.json();
}

/**
 * Deletes a work by id from the API.
 * @param {number} id - The id of the work to delete.
 * @param {string} token - The bearer token of the authenticated user.
 * @returns {Promise<void>}
 */
async function deleteWork(id, token) {
  const response = await fetch(`${API_URL}/works/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete work");
  }
}

/**
 * Sends a new work to the API.
 * @param {FormData} formData - The form data containing image, title and category.
 * @param {string} token - The bearer token of the authenticated user.
 * @returns {Promise<Object>} The created work object.
 */
async function addWork(formData, token) {
  const response = await fetch(`${API_URL}/works`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to add work");
  }

  return response.json();
}

export { addWork, API_URL, deleteWork, getCategories, getWorks, login };
