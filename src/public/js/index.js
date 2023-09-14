
// En tu código JavaScript
document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    const container = document.querySelector('.container2');
    const cartId = container.getAttribute('data-cartId');
    for (let i = 0; i < addToCartButtons.length; i++) {
        const button = addToCartButtons[i];
        button.addEventListener('click', () => {
          const productId = button.dataset.productId;
    
          // Realiza una solicitud POST al servidor para agregar el producto al carrito
          addToCart(cartId, productId);
        });
      }
    });
  
  async function addToCart(cartId, productId) {
    console.log(cartId)
    console.log(productId)
    const url = `/api/carts/${cartId}/products/${productId}`;
    try {
        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: 'POST'
          });
          console.log("¡añadido!");
          console.log(response)
        return response
    } catch(error)  {
      // Maneja cualquier error que ocurra durante la solicitud
      console.error(error);
    };
  }