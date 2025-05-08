const users = JSON.parse(process.env.USERS_DATA || '{"users":[]}'); 
const { username, password, firstName, lastName, email, phone } = JSON.parse(event.body);

if (!username || !password || !firstName || !lastName || !email || !phone) {
  return { statusCode: 400, body: JSON.stringify({ success: false, message: "Tutti i campi sono obbligatori!" }) };
}

if (users.users.find((u) => u.username === username)) {
  return { statusCode: 409, body: JSON.stringify({ success: false, message: "Utente già registrato!" }) };
}

users.users.push({ username, password, firstName, lastName, email, phone });

// 👉 Aggiorna il valore nella Environment Variable (metodo corretto)
process.env.USERS_DATA = JSON.stringify(users);

return { statusCode: 200, body: JSON.stringify({ success: true, message: "Registrazione completata!" }) };
