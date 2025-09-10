export default async function getCategories() {
  const res = await fetch(`https://ecommerce.routemisr.com/api/v1/categories`, {
    cache: "no-store"
  });
  
  const { data } = await res.json();
  return data;
}

export async function getCategoryById(categoryId: string) {
  const res = await fetch(`https://ecommerce.routemisr.com/api/v1/categories/${categoryId}`, {
    cache: "no-store"
  });
  
  const { data } = await res.json();
  return data;
}
