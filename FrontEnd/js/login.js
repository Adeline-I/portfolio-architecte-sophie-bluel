import { login } from "./api.js";

const form = document.getElementById("login-form");
const errorMessage = document.getElementById("login-error");

/**
 * Handles the login form submission: calls the API, stores the token
 * on success, or displays an error message on failure.
 * @param {SubmitEvent} event - The form submit event.
 */
async function handleLoginSubmit(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const { token } = await login(email, password);
    sessionStorage.setItem("token", token);
    window.location.href = "./index.html";
  } catch (error) {
    errorMessage.textContent = "Erreur dans l'identifiant ou le mot de passe.";
    errorMessage.classList.remove("hidden");
  }
}

form.addEventListener("submit", handleLoginSubmit);
