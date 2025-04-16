document.addEventListener("DOMContentLoaded", function () {
  if (!isAdmin()) {
    alert("Access Denied! Redirecting to Login.");
    window.location.href = "login.html";
    return;
  }
  loadUsers();
});

function isAdmin() {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  return loggedInUser && loggedInUser.role === "admin";
}

function loadUsers() {
  const usersList = document.getElementById("usersList");
  usersList.innerHTML = "";
  firebase
    .database()
    .ref("users")
    .once("value", function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        const user = childSnapshot.val();
        const tr = document.createElement("tr");
        tr.innerHTML = `
        <td>${user.username}</td>
        <td>${user.email || "No Email"}</td>
        <td>${user.role}</td>
        <td>${
          user.role !== "admin"
            ? `<button onclick="deleteUser('${user.username}')">Delete</button>`
            : "Admin"
        }</td>`;
        usersList.appendChild(tr);
      });
    });
}

function deleteUser(username) {
  firebase
    .database()
    .ref("users/" + username)
    .remove()
    .then(() => loadUsers());
}

function logout() {
  localStorage.removeItem("loggedInUser");
  alert("Logged out successfully!");
  window.location.href = "login.html";
}
