exports.handler = async (event) => {
  const { username, password } = JSON.parse(event.body);
  
  let users = JSON.parse(process.env.USERS || "[]");
  const user = users.find((u) => u.username === username && u.password === password);
  
  if (!user) {
    return { statusCode: 401, body: JSON.stringify({ success: false, message: "Credenziali errate!" }) };
  }

  return { statusCode: 200, body: JSON.stringify({ success: true, message: "Login effettuato!" }) };
};
