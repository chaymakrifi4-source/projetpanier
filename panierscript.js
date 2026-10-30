// Articles de démonstration de la boutique NOVATECH.
// Vous pouvez modifier les noms, descriptions et prix dans cette liste.
const products = [
  { id: 1, name: "PC portable Lenovo IdeaPad 3", detail: "Core i5 · 8 Go RAM · 512 Go SSD", price: 1899.000, icon: "💻", qty: 1 },
  { id: 2, name: "Casque JBL Tune 770NC", detail: "Bluetooth · Réduction de bruit", price: 299.000, icon: "🎧", qty: 1 },
  { id: 3, name: "Smartwatch Redmi Watch 5", detail: "Écran AMOLED · Bracelet noir", price: 459.000, icon: "⌚", qty: 1 },
  { id: 4, name: "Souris Logitech G502 Hero", detail: "Gaming · 11 boutons programmables", price: 179.000, icon: "🖱️", qty: 1 }
];

const DELIVERY_FEE = 8.000;
const money = value => value.toFixed(3).replace(".", ",") + " DT";

const cartItems = document.getElementById("cart-items");
const emptyCart = document.getElementById("empty-cart");
const subtotalEl = document.getElementById("subtotal");
const shippingEl = document.getElementById("shipping");
const totalEl = document.getElementById("total");
const countEl = document.getElementById("item-count");
const navCountEl = document.getElementById("nav-count");
const shippingNote = document.getElementById("shipping-note");
const toast = document.getElementById("toast");
let toastTimer;

function getSubtotal() {
  return products.reduce((sum, product) => sum + product.price * product.qty, 0);
}

function getItemCount() {
  return products.reduce((sum, product) => sum + product.qty, 0);
}

function getDeliveryFee() {
  const selectedDelivery = document.querySelector('input[name="delivery"]:checked');
  return selectedDelivery && selectedDelivery.value === "delivery" && products.length > 0 ? DELIVERY_FEE : 0;
}

function renderCart() {
  cartItems.innerHTML = "";
  const isEmpty = products.length === 0;
  emptyCart.hidden = !isEmpty;
  cartItems.hidden = isEmpty;
  document.getElementById("clear-cart").hidden = isEmpty;

  products.forEach(product => {
    const article = document.createElement("article");
    article.className = "cart-item";
    article.innerHTML = `
      <div class="product-image"><span class="product-emoji" aria-hidden="true">${product.icon}</span></div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.detail}</p>
        <span class="unit-price">${money(product.price)} / unité</span>
      </div>
      <div class="qty-control" aria-label="Quantité">
        <button type="button" data-action="decrease" data-id="${product.id}" aria-label="Diminuer la quantité">−</button>
        <span>${product.qty}</span>
        <button type="button" data-action="increase" data-id="${product.id}" aria-label="Augmenter la quantité">+</button>
      </div>
      <div class="item-end">
        <div class="item-price">${money(product.price * product.qty)}</div>
        <button class="remove-button" type="button" data-action="remove" data-id="${product.id}">Supprimer</button>
      </div>`;
    cartItems.appendChild(article);
  });

  const subtotal = getSubtotal();
  const fee = getDeliveryFee();
  const count = getItemCount();
  subtotalEl.textContent = money(subtotal);
  shippingEl.textContent = fee === 0 ? "Gratuite" : money(fee);
  totalEl.textContent = money(subtotal + fee);
  countEl.textContent = `(${count})`;
  navCountEl.textContent = count;
  shippingNote.textContent = fee ? "Frais fixes de livraison : 8,000 DT." : "Le retrait en magasin est gratuit.";
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2500);
}

cartItems.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const id = Number(button.dataset.id);
  const product = products.find(item => item.id === id);
  if (!product) return;

  if (button.dataset.action === "increase") {
    product.qty++;
  } else if (button.dataset.action === "decrease") {
    product.qty = Math.max(1, product.qty - 1);
  } else if (button.dataset.action === "remove") {
    const index = products.findIndex(item => item.id === id);
    if (index !== -1) products.splice(index, 1);
    showToast("Produit supprimé du panier.");
  }

  renderCart();
});

document.querySelectorAll('input[name="delivery"]').forEach(input => {
  input.addEventListener("change", renderCart);
});

document.getElementById("clear-cart").addEventListener("click", () => {
  products.splice(0, products.length);
  renderCart();
  showToast("Votre panier a été vidé.");
});

document.getElementById("continue-shopping").addEventListener("click", () => {
  showToast("Découvrez bientôt toute notre collection NOVATECH.");
});

document.getElementById("checkout").addEventListener("click", () => {
  if (products.length === 0) {
    showToast("Votre panier est vide.");
    return;
  }

  const delivery = document.querySelector('input[name="delivery"]:checked').value;
  const payment = document.querySelector('input[name="payment"]:checked').value;
  const deliveryText = delivery === "delivery" ? "Livraison à domicile" : "Retrait en magasin";
  const paymentText = payment === "delivery" ? "Paiement à la livraison" : "Paiement en magasin";
  alert(`Commande enregistrée (simulation) !\n${deliveryText}\n${paymentText}\nTotal : ${totalEl.textContent}`);
});

renderCart();
