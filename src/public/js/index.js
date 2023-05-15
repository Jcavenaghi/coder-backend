
// En tu código JavaScript
document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    for (let i = 0; i < addToCartButtons.length; i++) {
        const button = addToCartButtons[i];
        button.addEventListener('click', () => {
          const productId = button.dataset.productId;
          const cartId = "646241956ee9abd17719e473"; // Reemplaza "5" con el ID del carrito correspondiente
    
          // Realiza una solicitud POST al servidor para agregar el producto al carrito
          addToCart(cartId, productId);
        });
      }
    });
  
  async function addToCart(cartId, productId) {
    const url = `api/carts/${cartId}/products/${productId}`;
    try {
        const response = await fetch(url, {
            method: 'POST'
          });
          console.log("¡añadido!");
        return response
    } catch(error)  {
      // Maneja cualquier error que ocurra durante la solicitud
      console.error(error);
    };
  }