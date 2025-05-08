exports.handler = async (event, context) => {
  try {
    // Legge gli utenti dalla variabile di ambiente oppure usa il fallback se non esiste
    const users = JSON.parse(process.env.USERS_DATA || '{"users":[]}');
    
    // Estrae i dati dal body della richiesta
    const { username, password, firstName, lastName, email, phone } = JSON.parse(event.body);
    
    // Controlla che tutti i campi siano presenti
    if (!username || !password || !firstName || !lastName || !email || !phone) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: "Tutti i campi sono obbligatori!" })
      };
    }
    
    // Verifica se l'utente è già registrato
    if (users.users.find((u) => u.username === username)) {
      return {
        statusCode: 409,
        body: JSON.stringify({ success: false, message: "Utente già registrato!" })
      };
    }
    
    // Aggiunge il nuovo utente
    users.users.push({ username, password, firstName, lastName, email, phone });
    
    // Aggiorna la variabile di ambiente (anche se in ambiente serverless questo non è persistente)
    process.env.USERS_DATA = JSON.stringify(users);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Registrazione completata!" })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: "Errore interno", error: error.message })
    };
  }
};
