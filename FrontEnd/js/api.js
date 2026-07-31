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

export { API_URL, getCategories, getWorks, login };
