document.addEventListener("DOMContentLoaded", function () {
  loadAttractions();
  loadFavorites();
});

let allAttractions = []; // Store all attractions globally

function loadAttractions() {
  fetch("attractions.json")
    .then((response) => response.json())
    .then((data) => {
      allAttractions = data; // Save all attractions globally
      displayAttractions(allAttractions);
    })
    .catch((error) => console.error("Error loading attractions:", error));
}

// Function to display attractions based on category/filter
function displayAttractions(attractions) {
  const attractionsList = document.getElementById("attractionsList");
  attractionsList.innerHTML = ""; // Clear existing content

  attractions.forEach((attraction) => {
    const div = document.createElement("div");
    div.classList.add("attraction-card");
    div.innerHTML = `
            <img src="${attraction.image}" alt="${attraction.name}">
            <h3>${attraction.name}</h3>
             <h3>${attraction.address}</h3>
              <h3>Rating: ${attraction.rating}</h3>
            <p>${attraction.description}</p>
            <button onclick="saveFavorite('${attraction.name}', '${attraction.image}')">Save to Favorites</button>
        `;
    attractionsList.appendChild(div);
  });
}

// Function to filter attractions by category
function filterByCategory() {
  const selectedCategory = document.getElementById("filterCategory").value;

  if (selectedCategory === "all") {
    displayAttractions(allAttractions); // Show all attractions
  } else {
    const filtered = allAttractions.filter(
      (attraction) =>
        attraction.type.toLowerCase() === selectedCategory.toLowerCase()
    );
    displayAttractions(filtered);
  }
}

// Function to reset filters and show all attractions
function resetFilters() {
  document.getElementById("filterCategory").value = "all";
  displayAttractions(allAttractions);
}

// Function to save favorites
function saveFavorite(name, image) {
  if (!name || !image) {
    alert("Error saving favorite: Missing data.");
    return;
  }

  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) {
    alert("Please log in to save favorites.");
    return;
  }

  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // Check if already exists for this user
  if (
    favorites.some((fav) => fav.name === name && fav.user === user.username)
  ) {
    alert("Already added to favorites!");
    return;
  }

  favorites.push({
    name: name.trim(),
    image: image.trim(),
    user: user.username,
  });
  localStorage.setItem("favorites", JSON.stringify(favorites));
  alert("Added to favorites!");
}

function loadFavorites() {
  const favoritesList = document.getElementById("favoritesList");
  if (!favoritesList) return;

  // Check if a user is logged in
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) {
    favoritesList.innerHTML = "<p>Please log in to see your favorites.</p>";
    return;
  }

  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // Filter only favorites belonging to the logged-in user
  const userFavorites = favorites.filter((fav) => fav.user === user.username);

  favoritesList.innerHTML = ""; // Clear previous content

  if (userFavorites.length === 0) {
    favoritesList.innerHTML = "<p>You have no saved favorites yet.</p>";
    return;
  }

  userFavorites.forEach((fav) => {
    if (!fav.name || !fav.image) return;

    const div = document.createElement("div");
    div.classList.add("attraction-card");
    div.innerHTML = `
      <img src="${fav.image}" alt="${fav.name}" />
      <h3>${fav.name}</h3>
      <button onclick="removeFavorite('${fav.name}')">Remove</button>
    `;
    favoritesList.appendChild(div);
  });
}

// Function to remove favorite
function removeFavorite(name) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites = favorites.filter((fav) => fav.name !== name);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  loadFavorites();
}

// Redirect to favorites page
function viewFavorites() {
  window.location.href = "favorites.html";
}

// Redirect back to main page
function goBack() {
  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", function () {
  loadAttractions();
  loadFavorites();
  updateLoginButton();
});

function updateLoginButton() {
  let user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (user) {
    document.getElementById(
      "login-btn"
    ).innerText = `Logout (${user.username})`;
    document.getElementById("login-btn").setAttribute("onclick", "logout()");
  }
}

// Function to search attractions
function searchAttractions() {
  const searchQuery = document.getElementById("searchBox").value.toLowerCase();
  const filteredAttractions = allAttractions.filter((attraction) =>
    attraction.name.toLowerCase().includes(searchQuery)
  );

  displayAttractions(filteredAttractions);
}
