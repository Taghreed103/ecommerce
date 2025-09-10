export default async function getBrands() {
  const res = await fetch(`https://ecommerce.routemisr.com/api/v1/brands`, {
    cache: "no-store"
  });
  
  const { data } = await res.json();
  return data;
}

export async function getBrandById(brandId: string) {
  const res = await fetch(`https://ecommerce.routemisr.com/api/v1/brands/${brandId}`, {
    cache: "no-store"
  });
  
  const { data } = await res.json();
  return data;
}
