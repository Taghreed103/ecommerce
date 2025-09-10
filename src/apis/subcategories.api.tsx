export default async function getSubcategories() {
  const res = await fetch(`https://ecommerce.routemisr.com/api/v1/subcategories`, {
    cache: "no-store"
  });
  
  const { data } = await res.json();
  return data;
}

export async function getSubcategoriesByCategoryId(categoryId: string) {
  const res = await fetch(`https://ecommerce.routemisr.com/api/v1/categories/${categoryId}/subcategories`, {
    cache: "no-store"
  });
  
  const { data } = await res.json();
  return data;
}

export async function getSubcategoryById(subcategoryId: string) {
  const res = await fetch(`https://ecommerce.routemisr.com/api/v1/subcategories/${subcategoryId}`, {
    cache: "no-store"
  });
  
  const { data } = await res.json();
  return data;
}
