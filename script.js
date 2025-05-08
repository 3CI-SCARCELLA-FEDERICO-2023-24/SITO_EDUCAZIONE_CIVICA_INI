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
      
      fetch("/register", {
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
        .catch((err) => console.error(err));
    });
  }

  // --------------------- Login ---------------------
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      
      const username = document.getElementById("loginUsername").value;
      const password = document.getElementById("loginPassword").value;
      
      fetch("/login", {
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
            alert("Credenziali errate!");
          }
        })
        .catch((err) => console.error(err));
    });
  }
  
  // --------------------- Logout ---------------------
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function logout() {
      fetch("/logout", { method: "POST" })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            alert("Logout effettuato!");
            document.getElementById("logoutBtn").style.display = "none";
            document.getElementById("loginBtn").style.display = "inline-block";
            document.getElementById("registerBtn").style.display = "inline-block";
          }
        })
        .catch((err) => console.error(err));
    });
  }
  
  // --------------------- Barra di Ricerca ---------------------
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const cards = document.querySelectorAll(".card");

  function filterCards() {
    const term = searchInput.value.trim().toLowerCase();
    cards.forEach(card => {
      const title = card.getAttribute("data-title").toLowerCase();
      card.style.display = title.includes(term) ? "block" : "none";
    });
  }

  if (searchInput && searchButton && cards.length > 0) {
    searchInput.addEventListener("input", filterCards);
    searchButton.addEventListener("click", filterCards);
  }
  
  // --------------------- Evidenziazione Risultati Ricerca ---------------------
  const resultsElement = document.getElementById("searchResults");
  if (resultsElement) {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");
    if (query) {
      const sampleText = `Questo è un esempio di contenuto in cui la parola '${query}' viene evidenziata. La funzione di ricerca mette in risalto ogni occorrenza del termine ricercato.`;
      const regex = new RegExp(`(${query})`, "gi");
      const highlightedText = sampleText.replace(regex, `<span class="highlight">$1</span>`);
      resultsElement.innerHTML = highlightedText;
    }
  }
  
  // --------------------- Gestione Modali ---------------------
  window.showLogin = function showLogin() {
    const modal = document.getElementById("loginModal");
    if (modal) {
      modal.style.display = "flex";
    } else {
      console.error("Errore: Elemento 'loginModal' non trovato.");
    }
  };

  window.showRegister = function showRegister() {
    const modal = document.getElementById("registerModal");
    if (modal) {
      modal.style.display = "flex";
    } else {
      console.error("Errore: Elemento 'registerModal' non trovato.");
    }
  };

  window.closeModal = function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = "none";
    } else {
      console.error(`Errore: Elemento '${modalId}' non trovato.`);
    }
  };
});