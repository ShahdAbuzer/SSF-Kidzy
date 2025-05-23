const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;
const USERS_FILE = path.join(__dirname, "users.json");

app.use(express.json());
app.use(cors());
app.use(express.static(__dirname)); 
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "signup.html"));
});

const readUsers = () => {
  if (!fs.existsSync(USERS_FILE)) return [];
  const data = fs.readFileSync(USERS_FILE);
  return JSON.parse(data);
};

const writeUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  console.log("Users file updated:", users);
};

app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  let users = readUsers();

  if (users.some((user) => user.email === email)) {
    return res.json({ success: false, message: "Email already exists" });
  }

  users.push({ name, email, password });
  writeUsers(users);
  res.json({ success: true });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  let users = readUsers();

  const user = users.find(
    (user) => user.email === email && user.password === password
  );
  if (user) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
