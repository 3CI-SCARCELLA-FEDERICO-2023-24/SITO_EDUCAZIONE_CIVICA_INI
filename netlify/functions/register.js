exports.handler = async (event) => {
  const { username, password, firstName, lastName, email, phone } = JSON.parse(event.body);
  
  if (!username || !password || !firstName || !lastName || !email || !phone) {
    return { statusCode: 400, body: JSON.stringify({ success: false, message: "Tutti i campi sono obbligatori!" }) };
  }

  // Simulazione database (puoi sostituirlo con un database cloud)
  let users = JSON.parse(process.env.USERS || "[]");
  
  if (users.find((u) => u.username === username)) {
    return { statusCode: 409, body: JSON.stringify({ success: false, message: "Utente già registrato!" }) };
  }

  users.push({ username, password, firstName, lastName, email, phone });
  process.env.USERS = JSON.stringify(users);

  return { statusCode: 200, body: JSON.stringify({ success: true, message: "Registrazione completata!" }) };
};
