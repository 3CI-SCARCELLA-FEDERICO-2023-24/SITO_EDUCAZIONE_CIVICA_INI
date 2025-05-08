exports.handler = async (event, context) => {
  try {
    // Legge gli utenti dalla variabile di ambiente o usa il fallback
    const users = JSON.parse(process.env.USERS_DATA || '{"users":[]}');
    
    // Estrae username e password dal body della richiesta
    const { username, password } = JSON.parse(event.body);
    
    // Cerca un utente che corrisponda a username e password
    const user = users.users.find((u) => u.username === username && u.password === password);
    
    if (!user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ success: false, message: "Credenziali errate!" })
      };
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Login effettuato!" })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: "Errore interno", error: error.message })
    };
  }
};
