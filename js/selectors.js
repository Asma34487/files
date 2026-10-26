// Recherche un customer  par son identifiant
export function findCustomer(state, customerId) {
  return state.customers.find(c => c.id === customerId);
}
// Recherche un produit par son identifiant
export function findProduct(state, productId) {
  return state.products.find(p => p.id === productId);
}
// Transforme les articles d'une commande en lignes complètes
// avec le nom, la catégorie, le prix, la quantité et le mont
export function getOrderLines(state, order) {
  return order.items.map(item => {
    const product = findProduct(state, item.productId);
    return {
      name: product.name,
      category: product.category,
      price: product.price,
      quantity: item.quantity,
      amount: product.price * item.quantity
    };
  });
}
// Calcule le montant total d'une commande
export function getOrderTotal(state, order) {
  let total = 0;
  getOrderLines(state, order).forEach(line => {
    total += line.amount;
  });
  return total;
}
// Récupère les catégories des produits sans répétition
export function getCategories(state) {
  const categories = [];
  state.products.forEach(p => {
    if (!categories.includes(p.category)) categories.push(p.category);
  });
  return categories;
}
// Récupère les statuts des commandes sans répétition
export function getStatuses(state) {
  const statuses = [];
  state.orders.forEach(o => {
    if (!statuses.includes(o.status)) statuses.push(o.status);
  });
  return statuses;
}
// Filtre les commandes selon le nom du client,
// le statut et la catégorie des produits
export function getFilteredOrders(state) {
  return state.orders.filter(order => {
    const customer = findCustomer(state, order.customerId);
    const matchSearch = customer.name.toLowerCase().includes(state.search.toLowerCase());
    const matchStatus = state.status === "" || order.status === state.status;
    const matchCategory = state.category === "" ||
      getOrderLines(state, order).some(line => line.category === state.category);
    return matchSearch && matchStatus && matchCategory;
  });
}
// Calcule les statistiques : nombre de clients,
// nombre de produits, nombre de commandes et montant total
export function getStats(state) {
  let totalAmount = 0;
  state.orders.forEach(order => {
    totalAmount += getOrderTotal(state, order);
  });
  return {
    customers: state.customers.length,
    products: state.products.length,
    orders: state.orders.length,
    totalAmount: totalAmount
  };
}
