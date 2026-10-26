// Importer les fonctions nécessaires depuis selectors.js
import { findCustomer, getOrderLines, getOrderTotal, getStats } from "./selectors.js";
// Affiche les statistiques des clients, produits, commandes et montant total

export function renderStats(state) {
  const s = getStats(state);
  document.getElementById("stats").innerHTML = `
    <div class="col-6 col-md-3"><div class="card text-center p-3"><div class="text-muted">Clients</div><div class="fs-3">${s.customers}</div></div></div>
    <div class="col-6 col-md-3"><div class="card text-center p-3"><div class="text-muted">Produits</div><div class="fs-3">${s.products}</div></div></div>
    <div class="col-6 col-md-3"><div class="card text-center p-3"><div class="text-muted">Commandes</div><div class="fs-3">${s.orders}</div></div></div>
    <div class="col-6 col-md-3"><div class="card text-center p-3"><div class="text-muted">Montant cumule</div><div class="fs-3">${s.totalAmount} MAD</div></div></div>`;
}
// Remplit une liste déroulante avec les valeurs fournies
// en conservant la valeur déjà sélectionnée
export function renderSelect(id, firstLabel, values) {
  const select = document.getElementById(id);
  const current = select.value;
  select.innerHTML = `<option value="">${firstLabel}</option>`;
  values.forEach(v => {
    select.innerHTML += `<option value="${v}">${v}</option>`;
  });
  select.value = current;
}
// Affiche les commandes dans le tableau
// et un message si aucune commande n'est trouvée
export function renderOrders(state, orders) {
  const body = document.getElementById("orders-body");
  if (orders.length === 0) {
    body.innerHTML = `<tr><td colspan="6" class="text-center text-muted">Aucune commande trouvee</td></tr>`;
    return;
  }
  body.innerHTML = orders.map(order => {
    const customer = findCustomer(state, order.customerId);
    return `<tr>
      <td>#${order.id}</td>
      <td>${customer.name}</td>
      <td>${order.date}</td>
      <td><span class="badge text-bg-secondary">${order.status}</span></td>
      <td>${getOrderTotal(state, order)} MAD</td>
      <td><button class="btn btn-sm btn-primary btn-detail" data-id="${order.id}">Detail</button></td>
    </tr>`;
  }).join("");
}
// Affiche les informations détaillées d'une commande
// dans une fenêtre modale, avec les produits et le total
export function renderDetail(state, order) {
  const customer = findCustomer(state, order.customerId);
  const lines = getOrderLines(state, order);
  let rows = "";
    // Prépare une ligne du tableau pour chaque produit commandé
  lines.forEach(line => {
    rows += `<tr><td>${line.name}</td><td>${line.price} MAD</td><td>${line.quantity}</td><td>${line.amount} MAD</td></tr>`;
  });
    // Affiche le titre et le contenu de la fenêtre modale
  document.getElementById("modal-title").textContent = "Commande #" + order.id;
  document.getElementById("modal-body").innerHTML = `
    <p><strong>Client :</strong> ${customer.name}<br>
    <strong>Ville :</strong> ${customer.city}<br>
    <strong>Date :</strong> ${order.date}<br>
    <strong>Statut :</strong> ${order.status}</p>
    <table class="table table-sm">
      <thead><tr><th>Produit</th><th>Prix</th><th>Quantite</th><th>Montant</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <p class="fs-5"><strong>Total : ${getOrderTotal(state, order)} MAD</strong></p>`;
}
// Affiche un message d'erreur dans la page
export function showError(message) {
  const box = document.getElementById("error-box");
  box.textContent = message;
  box.classList.remove("d-none");
}
