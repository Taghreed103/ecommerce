const baseUrl = "https://ecommerce.routemisr.com/api/v1";

export async function getAllProducts() {
  const res = await fetch(`${baseUrl}/products`, {
    cache: "no-store"
  });
  return res.json();
}

export async function getProductById(productId: string) {
  const res = await fetch(`${baseUrl}/products/${productId}`, {
    cache: "no-store"
  });
  return res.json();
}

export async function getProductsByCategory(categoryId: string) {
  const res = await fetch(`${baseUrl}/products?category[in]=${categoryId}`, {
    cache: "no-store"
  });
  return res.json();
}

export async function getProductsBySubcategory(subcategoryId: string) {
  const res = await fetch(`${baseUrl}/products?subcategory[in]=${subcategoryId}`, {
    cache: "no-store"
  });
  return res.json();
}

export async function getProductsByBrand(brandId: string) {
  const res = await fetch(`${baseUrl}/products?brand[in]=${brandId}`, {
    cache: "no-store"
  });
  return res.json();
}