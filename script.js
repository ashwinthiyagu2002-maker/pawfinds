const pets = [
  {
    id: 1,
    name: "Milo",
    type: "Dog",
    breed: "Golden Retriever",
    city: "Austin",
    ageMonths: 5,
    price: 650,
    verified: true,
    vaccinated: true,
    temperament: "Playful",
    mark: "M",
    color: "linear-gradient(135deg, #f5c963, #e46f52)"
  },
  {
    id: 2,
    name: "Luna",
    type: "Cat",
    breed: "British Shorthair",
    city: "Seattle",
    ageMonths: 8,
    price: 420,
    verified: true,
    vaccinated: true,
    temperament: "Calm",
    mark: "L",
    color: "linear-gradient(135deg, #7d6fb2, #46a7a4)"
  },
  {
    id: 3,
    name: "Benny",
    type: "Rabbit",
    breed: "Mini Lop",
    city: "Denver",
    ageMonths: 4,
    price: 120,
    verified: false,
    vaccinated: false,
    temperament: "Gentle",
    mark: "B",
    color: "linear-gradient(135deg, #95cdb0, #f4b05e)"
  },
  {
    id: 4,
    name: "Pip",
    type: "Bird",
    breed: "Parakeet",
    city: "Miami",
    ageMonths: 7,
    price: 95,
    verified: true,
    vaccinated: false,
    temperament: "Social",
    mark: "P",
    color: "linear-gradient(135deg, #247a78, #8bd6d2)"
  },
  {
    id: 5,
    name: "Nala",
    type: "Cat",
    breed: "Maine Coon",
    city: "Chicago",
    ageMonths: 10,
    price: 780,
    verified: true,
    vaccinated: true,
    temperament: "Curious",
    mark: "N",
    color: "linear-gradient(135deg, #e46f52, #f1d28a)"
  },
  {
    id: 6,
    name: "Scout",
    type: "Dog",
    breed: "Beagle",
    city: "Portland",
    ageMonths: 6,
    price: 540,
    verified: false,
    vaccinated: true,
    temperament: "Friendly",
    mark: "S",
    color: "linear-gradient(135deg, #365f8c, #8abf8e)"
  }
];

const state = {
  favorites: new Set(),
  search: "",
  type: "all",
  budget: 1500,
  verifiedOnly: false,
  vaccinatedOnly: false,
  sort: "featured"
};

const grid = document.querySelector("#listingGrid");
const favoriteCount = document.querySelector("#favoriteCount");
const budget = document.querySelector("#budget");
const budgetOutput = document.querySelector("#budgetOutput");
const toast = document.querySelector("#toast");

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function filteredPets() {
  const term = state.search.toLowerCase();
  const visible = pets.filter((pet) => {
    const matchesSearch = [pet.name, pet.type, pet.breed, pet.city, pet.temperament]
      .join(" ")
      .toLowerCase()
      .includes(term);

    return matchesSearch &&
      (state.type === "all" || pet.type === state.type) &&
      pet.price <= state.budget &&
      (!state.verifiedOnly || pet.verified) &&
      (!state.vaccinatedOnly || pet.vaccinated);
  });

  return visible.sort((a, b) => {
    if (state.sort === "price-low") return a.price - b.price;
    if (state.sort === "price-high") return b.price - a.price;
    if (state.sort === "youngest") return a.ageMonths - b.ageMonths;
    return Number(b.verified) - Number(a.verified) || a.price - b.price;
  });
}

function render() {
  const visible = filteredPets();
  favoriteCount.textContent = state.favorites.size;
  budgetOutput.textContent = money(state.budget);

  if (!visible.length) {
    grid.innerHTML = `<p class="empty">No listings match those filters.</p>`;
    return;
  }

  grid.innerHTML = visible.map((pet) => `
    <article class="pet-card">
      <div class="pet-photo" style="background:${pet.color}" aria-label="${pet.name}, ${pet.breed}">
        <span aria-hidden="true">${pet.mark}</span>
      </div>
      <div class="pet-card-content">
        <header>
          <div>
            <h3>${pet.name}</h3>
            <p>${pet.breed} · ${pet.city}</p>
          </div>
          <span class="price">${money(pet.price)}</span>
        </header>
        <div class="tags">
          <span class="tag">${pet.ageMonths} months</span>
          <span class="tag">${pet.temperament}</span>
          ${pet.verified ? `<span class="tag">Verified</span>` : ""}
          ${pet.vaccinated ? `<span class="tag">Vaccinated</span>` : ""}
        </div>
        <div class="card-actions">
          <button class="favorite" data-favorite="${pet.id}" aria-label="Favorite ${pet.name}" title="Favorite">
            ${state.favorites.has(pet.id) ? "♥" : "♡"}
          </button>
          <button class="contact" data-contact="${pet.name}">Contact seller</button>
        </div>
      </div>
    </article>
  `).join("");

  grid.querySelectorAll("[data-favorite]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.favorite);
      if (state.favorites.has(id)) {
        state.favorites.delete(id);
      } else {
        state.favorites.add(id);
      }
      render();
    });
  });

  grid.querySelectorAll("[data-contact]").forEach((button) => {
    button.addEventListener("click", () => {
      showToast(`Seller contact request started for ${button.dataset.contact}.`);
    });
  });
}

document.querySelector("#search").addEventListener("input", (event) => {
  state.search = event.target.value;
  render();
});

document.querySelector("#type").addEventListener("change", (event) => {
  state.type = event.target.value;
  render();
});

budget.addEventListener("input", (event) => {
  state.budget = Number(event.target.value);
  render();
});

document.querySelector("#verifiedOnly").addEventListener("change", (event) => {
  state.verifiedOnly = event.target.checked;
  render();
});

document.querySelector("#vaccinatedOnly").addEventListener("change", (event) => {
  state.vaccinatedOnly = event.target.checked;
  render();
});

document.querySelector("#sort").addEventListener("change", (event) => {
  state.sort = event.target.value;
  render();
});

document.querySelector("#favoritesButton").addEventListener("click", () => {
  showToast(state.favorites.size ? `${state.favorites.size} saved listing${state.favorites.size > 1 ? "s" : ""}.` : "No saved listings yet.");
});

document.querySelector("#listingForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const newPet = {
    id: Date.now(),
    name: form.get("name").trim(),
    type: form.get("type"),
    breed: form.get("breed").trim(),
    city: form.get("city").trim(),
    ageMonths: 3,
    price: Number(form.get("price")),
    verified: false,
    vaccinated: false,
    temperament: "New",
    mark: form.get("name").trim().slice(0, 1).toUpperCase(),
    color: "linear-gradient(135deg, #247a78, #e46f52)"
  };

  pets.unshift(newPet);
  event.currentTarget.reset();
  showToast(`${newPet.name} is now listed.`);
  render();
});

render();
