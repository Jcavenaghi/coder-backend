const socket = io();
socket.emit('message', 'cliente conectado');
// Handle incoming product data
socket.on('update-products', function(products) {
  const productList = document.getElementById('product-list');
  productList.innerHTML = '';
  products.forEach(function(product) {
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.classList.add('delete-product-button');
    button.setAttribute('data-product-id', product.id);
    button.textContent= 'Eliminar' ;
    li.textContent = product.title + ' - ' + product.price;
    li.appendChild(button);
    productList.appendChild(li);
  });
});

socket.on('product-data', function(data) {
  const productList = document.getElementById('product-list');
  const li = document.createElement('li');
  const button = document.createElement('button');
  button.classList.add('delete-product-button');
  button.setAttribute('data-product-id', data.products.id);
  button.textContent= 'Eliminar' ;
  li.textContent = data.products.title + ' - ' + data.products.price;
  li.appendChild(button);
  
  productList.appendChild(li);
})

// Handle form submit
const addProductForm = document.getElementById('add-product-form');
addProductForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const productTitleInput = document.getElementById('product-title');
  const productPriceInput = document.getElementById('product-price');
  const productDescriptionInput = document.getElementById('product-description');
  const productCodeInput = document.getElementById('product-code');
  const productStockInput = document.getElementById('product-stock');
  const productCategoryInput = document.getElementById('product-category');


  const productTitle= productTitleInput.value.trim();
  const productPrice = parseFloat(productPriceInput.value.trim());
  const productStock = productStockInput.value.trim();
  const productCode = parseInt(productCodeInput.value.trim());
  const productDescription = productDescriptionInput.value.trim();
  const productCategory = productCategoryInput.value.trim();
  
  if (!productTitle || isNaN(productPrice)) {
    return;
  }

  socket.emit('add-product', { title: productTitle, status: true, price: productPrice, category: productCategory, code: productCode, stock: productStock, description: productDescription });

  productTitleInput.value = '';
  productPriceInput.value = '';
});

// Escuchar los clics en los botones de eliminación de productos
document.getElementById('product-list').addEventListener('click', function(event) {
  // Buscar el botón de eliminación más cercano al elemento clickeado
  const deleteButton = event.target.closest('.delete-product-button');
  
  // Si se encontró un botón de eliminación, obtener el ID del producto
  if (deleteButton) {
    const productId = deleteButton.getAttribute('data-product-id');
    // Enviar la señal al servidor para eliminar el producto
    socket.emit('delete-product', productId);
  }
});