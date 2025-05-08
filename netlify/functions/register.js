const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  
  console.log("Supabase URL:", process.env.SUPABASE_URL);
  console.log("Supabase Service Role Key:", process.env.SUPABASE_SERVICE_ROLE_KEY);

  try {
    // Inizializza Supabase con le variabili di ambiente
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Recupera i dati dal body della richiesta
    const { username, password, firstName, lastName, email, phone } = JSON.parse(event.body);

    // Controlla che tutti i campi siano presenti
    if (!username || !password || !firstName || !lastName || !email || !phone) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: "Tutti i campi sono obbligatori!" }),
      };
    }

    // Controlla se l'utente esiste già nel database
    const { data: existingUsers, error: selectError } = await supabase
      .from('users')
      .select('id')
      .eq('username', username);

    if (selectError) throw selectError;
    if (existingUsers.length > 0) {
      return {
        statusCode: 409,
        body: JSON.stringify({ success: false, message: "Utente già registrato!" }),
      };
    }

    // Inserisce il nuovo utente nel database
    const { data, error: insertError } = await supabase
      .from('users')
      .insert([{ username, password, firstName, lastName, email, phone }]);

    if (insertError) throw insertError;

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Registrazione completata!" }),
    };

  } catch (error) {
    console.error("Errore nella registrazione:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: "Errore interno", error: error.message }),
    };
  }
};
