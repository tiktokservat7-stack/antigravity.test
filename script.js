(function () {
  // ----- Base de données de jeux Roblox (simulée) -----
  const games = [
    {
      id: 1,
      title: "Blox Fruits",
      genre: "Aventure · Combat",
      price: 450,
      emoji: "🍈⚔️",
      bgGradient: "linear-gradient(145deg, #16635b, #0b3b3f)"
    },
    {
      id: 2,
      title: "Adopt Me!",
      genre: "Rôle · Animaux",
      price: 300,
      emoji: "🐾🍼",
      bgGradient: "linear-gradient(145deg, #e67e9c, #b54a6b)"
    },
    {
      id: 3,
      title: "Murder Mystery 2",
      genre: "Mystère · Social",
      price: 275,
      emoji: "🔪🕵️",
      bgGradient: "linear-gradient(145deg, #2d2f4b, #1b1d35)"
    },
    {
      id: 4,
      title: "Tower of Hell",
      genre: "Obstacle · Course",
      price: 180,
      emoji: "🏗️⏱️",
      bgGradient: "linear-gradient(145deg, #b14b3c, #732c26)"
    },
    {
      id: 5,
      title: "Jailbreak",
      genre: "Action · Voitures",
      price: 520,
      emoji: "🚔💰",
      bgGradient: "linear-gradient(145deg, #2f4b6e, #1c2b44)"
    },
    {
      id: 6,
      title: "Pet Simulator X",
      genre: "Collection · Animaux",
      price: 390,
      emoji: "💎🐱",
      bgGradient: "linear-gradient(145deg, #9b59b6, #5e337c)"
    }
  ];

  // ----- État du panier -----
  let cart = []; // Stocke les IDs des jeux (ou objets avec id, title, price)

  // ----- Références DOM -----
  const gamesContainer = document.getElementById('gamesContainer');
  const cartCountSpan = document.getElementById('cart-count');
  const cartTotalDisplay = document.getElementById('cart-total-display');
  const cartItemsList = document.getElementById('cart-items-list');
  const clearCartBtn = document.getElementById('clearCartBtn');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const checkoutTotalSpan = document.getElementById('checkout-total');

  // ----- Fonctions d'affichage -----

  // Afficher les jeux dans la grille
  function renderGames() {
    if (!gamesContainer) return;
    gamesContainer.innerHTML = '';

    games.forEach(game => {
      const card = document.createElement('div');
      card.className = 'game-card';
      card.setAttribute('data-game-id', game.id);

      // Image stylisée (emoji + fond)
      const imgDiv = document.createElement('div');
      imgDiv.className = 'game-img';
      imgDiv.style.background = game.bgGradient || 'linear-gradient(135deg, #2b2f4a, #1b1e33)';
      const emojiSpan = document.createElement('span');
      emojiSpan.textContent = game.emoji || '🎮';
      imgDiv.appendChild(emojiSpan);

      // Titre
      const titleEl = document.createElement('h3');
      titleEl.className = 'game-title';
      titleEl.textContent = game.title;

      // Genre
      const genreEl = document.createElement('div');
      genreEl.className = 'game-genre';
      genreEl.innerHTML = `🎯 ${game.genre}`;

      // Prix + bouton
      const priceRow = document.createElement('div');
      priceRow.className = 'price-row';

      const priceSpan = document.createElement('span');
      priceSpan.className = 'price';
      priceSpan.textContent = `${game.price} R$`;

      const buyButton = document.createElement('button');
      buyButton.className = 'buy-btn';
      buyButton.innerHTML = `🛒 Acheter`;
      buyButton.setAttribute('data-id', game.id);
      buyButton.addEventListener('click', (e) => {
        e.stopPropagation();
        addToCart(game.id);
      });

      priceRow.appendChild(priceSpan);
      priceRow.appendChild(buyButton);

      card.appendChild(imgDiv);
      card.appendChild(titleEl);
      card.appendChild(genreEl);
      card.appendChild(priceRow);
      gamesContainer.appendChild(card);
    });
  }

  // Ajouter un jeu au panier
  function addToCart(gameId) {
    const game = games.find(g => g.id === gameId);
    if (!game) return;

    // On stocke un objet simplifié
    cart.push({
      id: game.id,
      title: game.title,
      price: game.price
    });

    updateCartUI();
    // Petit retour visuel (optionnel)
    animateCartBadge();
  }

  // Retirer un article du panier par son index dans le tableau cart
  function removeFromCart(index) {
    if (index >= 0 && index < cart.length) {
      cart.splice(index, 1);
      updateCartUI();
    }
  }

  // Vider tout le panier
  function clearCart() {
    if (cart.length === 0) return;
    cart = [];
    updateCartUI();
  }

  // Calculer le total
  function getCartTotal() {
    return cart.reduce((sum, item) => sum + item.price, 0);
  }

  // Mise à jour complète de l'interface panier
  function updateCartUI() {
    const total = getCartTotal();
    const count = cart.length;

    // Badge compteur
    if (cartCountSpan) cartCountSpan.textContent = count;
    if (cartTotalDisplay) cartTotalDisplay.textContent = `${total} Robux`;
    if (checkoutTotalSpan) checkoutTotalSpan.textContent = total;

    // Liste détaillée du panier
    if (cartItemsList) {
      cartItemsList.innerHTML = '';

      if (cart.length === 0) {
        cartItemsList.innerHTML = '<li class="empty-cart-message">🛒 Votre panier est vide pour le moment.</li>';
      } else {
        cart.forEach((item, index) => {
          const li = document.createElement('li');
          li.className = 'cart-item';
          li.innerHTML = `
            <span>🎮 ${item.title} <span style="color:#ffd966; margin-left:0.5rem;">${item.price} R$</span></span>
            <button class="remove-item" data-index="${index}">✕ Retirer</button>
          `;
          // Attacher l'événement de suppression
          const removeBtn = li.querySelector('.remove-item');
          if (removeBtn) {
            removeBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              const idx = parseInt(removeBtn.getAttribute('data-index'), 10);
              removeFromCart(idx);
            });
          }
          cartItemsList.appendChild(li);
        });
      }
    }
  }

  // Petite animation sur le badge
  function animateCartBadge() {
    if (!cartCountSpan) return;
    cartCountSpan.style.transform = 'scale(1.3)';
    setTimeout(() => {
      if (cartCountSpan) cartCountSpan.style.transform = 'scale(1)';
    }, 180);
  }

  // Simuler le paiement (checkout)
  function proceedToCheckout() {
    if (cart.length === 0) {
      alert("🛑 Votre panier est vide. Ajoutez des jeux Roblox avant de payer.");
      return;
    }
    const total = getCartTotal();
    const gameList = cart.map(item => item.title).join(', ');
    alert(`✅ Simulation d'achat réussie !\n\n📦 Jeux : ${gameList}\n💰 Total : ${total} Robux\n\n(Transaction fictive – aucun vrai achat.)`);
    // Vider le panier après achat (simulé)
    clearCart();
  }

  // ----- Écouteurs d'événements globaux -----
  clearCartBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      alert("Le panier est déjà vide.");
      return;
    }
    clearCart();
  });

  checkoutBtn.addEventListener('click', proceedToCheckout);

  // Pour le toggle panier (optionnel : focus sur la section)
  document.getElementById('cart-toggle').addEventListener('click', () => {
    document.getElementById('cartDetailSection').scrollIntoView({ behavior: 'smooth' });
  });

  // ----- Initialisation -----
  renderGames();
  updateCartUI(); // panier vide au départ
})();
