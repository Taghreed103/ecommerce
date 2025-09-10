export async function addToWishlist(productId: string, token: string) {
  const res = await fetch(`https://ecommerce.routemisr.com/api/v1/wishlist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "token": token
    },
    body: JSON.stringify({ productId })
  });
  
  const data = await res.json();
  return data;
}

export async function removeFromWishlist(productId: string, token: string) {
  const res = await fetch(`https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "token": token
    }
  });
  
  const data = await res.json();
  return data;
}

export async function getWishlist(token: string) {
  const res = await fetch(`https://ecommerce.routemisr.com/api/v1/wishlist`, {
    headers: {
      "Content-Type": "application/json",
      "token": token
    }
  });
  
  const { data } = await res.json();
  return data;
}
