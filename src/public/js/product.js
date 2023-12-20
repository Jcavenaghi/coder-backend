// En tu código JavaScript
document.addEventListener('DOMContentLoaded', () => {
    const addToCartButton = document.querySelector(".add-to-cart-btn");
  
    // Agrega un evento de clic al botón
    addToCartButton.addEventListener("click", function () {
        // se obtiene el valor del atributo 'data-product-id'
        const productId = this.getAttribute("data-product-id");
        // Se obtiene el valor del atributo 'data-cart-id'
        const cartId = addToCartButton.getAttribute("data-cart-id")
        // Llama al método addProduct con el productId
        addToCart(cartId, productId);
    });
});
  
  async function addToCart(cartId, productId) {
    const url = `/api/carts/${cartId}/products/${productId}`;
    try {
        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: 'POST'
          });
          swal({
            icon: 'success',
            title: 'producto añadido',
            showConfirmButton: false,
            timer: 1200 // Adjust the timer as needed
        })
        return response
    } catch(error)  {
      // Maneja cualquier error que ocurra durante la solicitud
      console.error(error);
    };
  }