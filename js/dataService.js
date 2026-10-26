
async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error("Impossible de charger " + path + " (code " + response.status + ")");
  }
  return await response.json();
}

export async function loadAllData() {
  try {
    const [customers, products, orders] = await Promise.all([
      loadJson("data/customers.json"),
      loadJson("data/products.json"),
      loadJson("data/orders.json")
    ]);
    return { customers, products, orders };
  } catch (error) {
    console.error("Erreur de chargement :", error);
    throw error; 
  }
}
