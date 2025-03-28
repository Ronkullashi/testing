let users = JSON.parse(localStorage.getItem("users")) || {};
let currentUser = localStorage.getItem("currentUser");

function saveUsers() {
  localStorage.setItem("users", JSON.stringify(users));
}

function updateUI() {
  const app = document.getElementById("app");
  const auth = document.getElementById("auth");
  const usernameSpan = document.getElementById("username");

  if (currentUser) {
    auth.classList.add("hidden");
    app.classList.remove("hidden");
    usernameSpan.textContent = users[currentUser].name;
    loadFeed();
  } else {
    auth.classList.remove("hidden");
    app.classList.add("hidden");
  }
}

function signUp() {
  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const pass = document.getElementById("signup-pass").value;

  if (!email || !pass || !name) return alert("Fill all fields");
  if (users[email]) return alert("User already exists");

  users[email] = {
    name,
    password: pass,
    posts: [],
    following: []
  };
  saveUsers();
  alert("Account created! You can log in now.");
}

function login() {
  const email = document.getElementById("login-email").value.trim();
  const pass = document.getElementById("login-pass").value;

  if (users[email] && users[email].password === pass) {
    currentUser = email;
    localStorage.setItem("currentUser", email);
    updateUI();
  } else {
    alert("Invalid login");
  }
}

function logout() {
  currentUser = null;
  localStorage.removeItem("currentUser");
  updateUI();
}

function createPost() {
  const content = document.getElementById("blog-content").value.trim();
  if (!content) return;

  users[currentUser].posts.push({ content, timestamp: Date.now() });
  saveUsers();
  document.getElementById("blog-content").value = "";
  loadFeed();
}

function followUser() {
  const target = document.getElementById("follow-email").value.trim();
  if (!users[target]) return alert("User not found");
  if (target === currentUser) return alert("You can't follow yourself");

  if (!users[currentUser].following.includes(target)) {
    users[currentUser].following.push(target);
    saveUsers();
    loadFeed();
  } else {
    alert("You're already following this user.");
  }
}

function loadFeed() {
  const feed = document.getElementById("feed");
  const following = users[currentUser].following;
  let posts = [];

  following.forEach(userEmail => {
    users[userEmail].posts.forEach(post => {
      posts.push({ ...post, author: users[userEmail].name });
    });
  });

  // Show user's own posts too
  users[currentUser].posts.forEach(post => {
    posts.push({ ...post, author: users[currentUser].name });
  });

  posts.sort((a, b) => b.timestamp - a.timestamp);

  feed.innerHTML = posts.map(p => `
    <div class="post">
      <strong>${p.author}</strong><br>
      <p>${p.content}</p>
      <small>${new Date(p.timestamp).toLocaleString()}</small>
    </div>
  `).join('');
}

updateUI();

