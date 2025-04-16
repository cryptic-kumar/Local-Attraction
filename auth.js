document.addEventListener("DOMContentLoaded", function () {
  checkLoggedInUser();

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      login();
    });
  }

  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      register();
    });
  }
});

// 🟢 Register Function using Firebase
function register() {
  const username = document.getElementById("registerUsername").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value.trim();

  if (!username || !email || !password) {
    alert("Please enter all fields.");
    return;
  }

  const role = username.toLowerCase() === "admin" ? "admin" : "user";

  // Disable the submit button to prevent double submissions
  const submitButton = document.querySelector("button[type='submit']");
  submitButton.disabled = true;

  // Check if user already exists in Firebase
  firebase
    .database()
    .ref("users/" + username)
    .get()
    .then((snapshot) => {
      if (snapshot.exists()) {
        alert("Username already exists! Choose another.");
        submitButton.disabled = false; // Re-enable button
        return;
      }

      const newUser = { username, email, password, role };

      // Save the new user data to Firebase
      firebase
        .database()
        .ref("users/" + username)
        .set(newUser)
        .then(() => {
          alert("Registration successful! You can now log in.");
          window.location.href = "login.html";
        })
        .catch((error) => {
          console.error("Error saving user:", error);
          alert("An error occurred while registering. Please try again.");
          submitButton.disabled = false; // Re-enable button
        });
    })
    .catch((error) => {
      console.error("Error checking user:", error);
      alert("An error occurred while checking the username. Please try again.");
      submitButton.disabled = false; // Re-enable button
    });
}

// 🔵 Login Function using Firebase
function login() {
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  firebase
    .database()
    .ref("users/" + username)
    .get()
    .then((snapshot) => {
      if (!snapshot.exists()) {
        alert("Invalid username or password.");
        return;
      }

      const user = snapshot.val();

      if (user.password !== password) {
        alert("Invalid username or password.");
        return;
      }

      localStorage.setItem("loggedInUser", JSON.stringify(user));
      alert(`Welcome, ${user.username}!`);

      if (user.role === "admin") {
        window.location.href = "admin.html";
      } else {
        window.location.href = "index.html";
      }
    })
    .catch((error) => {
      console.error("Login error:", error);
      alert("An error occurred while logging in.");
    });
}

// 🔴 Logout Function
function logout() {
  localStorage.removeItem("loggedInUser");
  alert("Logged out successfully!");
  window.location.href = "login.html";
}

// 🟡 Update login button if user is already logged in
function checkLoggedInUser() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  if (user) {
    const loginBtn = document.getElementById("login-btn");
    if (loginBtn) {
      loginBtn.innerText = `Logout (${user.username})`;
      loginBtn.setAttribute("onclick", "logout()");
    }
  }
}
