const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const USERS_FILE = path.join(__dirname, "users.json");

// Middleware per gestire il JSON e i file statici
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Funzione per caricare gli utenti dal file JSON (creandolo se non esiste)
function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, "[]");
  }
  return JSON.parse(fs.readFileSync(USERS_FILE));
}

// Funzione per salvare un nuovo utente (controlla duplicati)
function saveUser(user) {
  let users = loadUsers();
  if (users.find((u) => u.username === user.username)) {
    return false;
  }
  users.push(user);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  return true;
}

// Endpoint per la registrazione
app.post("/register", (req, res) => {
  const { username, password, firstName, lastName, email, phone } = req.body;
  if (!username || !password || !firstName || !lastName || !email || !phone) {
    return res.json({ success: false, message: "Tutti i campi sono obbligatori" });
  }
  if (saveUser({ username, password, firstName, lastName, email, phone })) {
    return res.json({ success: true });
  } else {
    return res.json({ success: false, message: "Utente già registrato" });
  }
});

// Endpoint per il login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  let users = loadUsers();
  const user = users.find((u) => u.username === username && u.password === password);
  if (user) {
    return res.json({ success: true, user });
  } else {
    return res.json({ success: false, message: "Credenziali errate" });
  }
});

// Endpoint per il logout (a livello di API)
app.post("/logout", (req, res) => {
  return res.json({ success: true });
});

// Avvio del server
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});