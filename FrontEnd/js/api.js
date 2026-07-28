const API_URL = "http://localhost:5678/api";

async function getWorks() {
  const response = await fetch(`${API_URL}/works`);
  if (!response.ok) {
    throw new Error("Failed to fetch works");
  }
  return response.json();
}

export { API_URL, getWorks };
