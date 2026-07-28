import { getWorks } from "./api.js";

const gallery = document.querySelector(".gallery");

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

function displayWorks(works) {
  gallery.innerHTML = "";
  works.forEach((work) => {
    gallery.appendChild(createWorkElement(work));
  });
}

async function initGallery() {
  try {
    const works = await getWorks();
    displayWorks(works);
  } catch (error) {
    console.error(error);
  }
}

initGallery();
