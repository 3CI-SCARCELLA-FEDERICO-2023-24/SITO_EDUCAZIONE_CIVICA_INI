document.addEventListener("DOMContentLoaded", function () {
  // --------------------- Registrazione ---------------------
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const firstName = document.getElementById("registerFirstName").value;
      const lastName = document.getElementById("registerLastName").value;
      const email = document.getElementById("registerEmail").value;
      const phone = document.getElementById("registerPhone").value;
      const username = document.getElementById("registerUsername").value;
      const password = document.getElementById("registerPassword").value;

      fetch("/.netlify/functions/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, phone, username, password }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            alert("Registrazione completata!");
            closeModal("registerModal");
          } else {
            alert("Errore: " + data.message);
          }
        })
        .catch((err) => console.error("Errore nella registrazione:", err));
    });
  }

  // --------------------- Login ---------------------
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const username = document.getElementById("loginUsername").value;
      const password = document.getElementById("loginPassword").value;

      fetch("/.netlify/functions/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            alert("Login effettuato con successo!");
            closeModal("loginModal");
            document.getElementById("logoutBtn").style.display = "inline-block";
            document.getElementById("loginBtn").style.display = "none";
            document.getElementById("registerBtn").style.display = "none";
          } else {
            alert("Credenziali errate.");
          }
        })
        .catch((err) => console.error("Errore nel login:", err));
    });
  }

  // --------------------- Logout ---------------------
  function logout() {
    fetch("/.netlify/functions/logout", { method: "POST" })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Logout effettuato!");
          document.getElementById("logoutBtn").style.display = "none";
          document.getElementById("loginBtn").style.display = "inline-block";
          document.getElementById("registerBtn").style.display = "inline-block";
        }
      })
      .catch((err) => console.error("Errore nel logout:", err));
  }
  
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }

  // --------------------- Barra di Ricerca ---------------------
  function performSearch() {
    const query = document.getElementById("searchInput").value;
    window.location.href = "pag/search.html?q=" + encodeURIComponent(query);
  }
  window.performSearch = performSearch;

  // --------------------- Evidenziazione Risultati Ricerca ---------------------
  if (document.getElementById("searchResults")) {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");
    if (query) {
      let resultsElement = document.getElementById("searchResults");
      let sampleText = `Questo è un esempio di contenuto in cui la parola '${query}' viene evidenziata.`;
      let regex = new RegExp("(" + query + ")", "gi");
      let highlightedText = sampleText.replace(regex, `<span class="highlight">$1</span>`);
      resultsElement.innerHTML = highlightedText;
    }
  }

  // --------------------- Gestione Modali ---------------------
  function showLogin() {
    const modal = document.getElementById("loginModal");
    if (modal) {
      modal.style.display = "flex";
    } else {
      console.error("Errore: Elemento 'loginModal' non trovato.");
    }
  }

  function showRegister() {
    const modal = document.getElementById("registerModal");
    if (modal) {
      modal.style.display = "flex";
    } else {
      console.error("Errore: Elemento 'registerModal' non trovato.");
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = "none";
    } else {
      console.error(`Errore: Elemento '${modalId}' non trovato.`);
    }
  }

  // Rendo globali le funzioni per i modali
  window.showLogin = showLogin;
  window.showRegister = showRegister;
  window.closeModal = closeModal;
});
