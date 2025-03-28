import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Load users from JSON
const loadUsers = () => {
  const data = fs.readFileSync("users.json");
  return JSON.parse(data);
};

// Route to get all users
app.get("/users", (req, res) => {
  const users = loadUsers();
  res.json(users);
});

// Route to find user by email
app.get("/users/:email", (req, res) => {
  const email = req.params.email.toLowerCase();
  const users = loadUsers();
  const found = users.find(user => user.email.toLowerCase() === email);

  if (found) {
    res.json(found);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
