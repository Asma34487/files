// Initialisation et evenements
import { state } from "./state.js"; // state
import { loadAllData } from "./dataService.js";// charge data json
import { getFilteredOrders, getCategories, getStatuses } from "./selectors.js";// calcul
import { renderStats, renderSelect, renderOrders, renderDetail, showError } from "./view.js"; // affichage 

function render() {
  renderStats(state);
  renderSelect("status-filter", "Tous les statuts", getStatuses(state));
  renderSelect("category-filter", "Toutes les categories", getCategories(state));
  renderOrders(state, getFilteredOrders(state));
}

function setupEvents() {
  document.getElementById("search").addEventListener("input", e => {
    state.search = e.target.value;
    render();
  });
  document.getElementById("status-filter").addEventListener("change", e => {
    state.status = e.target.value;
    render();
  });
  document.getElementById("category-filter").addEventListener("change", e => {
    state.category = e.target.value;
    render();
  });
  document.getElementById("orders-body").addEventListener("click", e => {
    if (e.target.classList.contains("btn-detail")) {
      const id = Number(e.target.dataset.id);
      const order = state.orders.find(o => o.id === id);
      renderDetail(state, order);
      new bootstrap.Modal(document.getElementById("detail-modal")).show();
    }
  });
}

async function init() {
  try {
    const data = await loadAllData();
    state.customers = data.customers;
    state.products = data.products;
    state.orders = data.orders;
    setupEvents();
    render(); 
  } catch (error) {
    showError("Erreur : les donnees n'ont pas pu etre chargees. " + error.message);
  }
}

init();
