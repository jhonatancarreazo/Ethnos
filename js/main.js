//const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
const getProduct = async () => {
    try {
        const response = await fetch('https://fakestoreapi.com/productss');
        const products = await response.json();

        let productosHTML = '';
        products.forEach(producto => {
            let titulo = producto.title;
            let image = producto.image;
            let price = producto.price;
            let productId = producto.id;

            productosHTML += `<div class="card" id="product-${productId}">
            <img src="${image}" alt="${titulo}">
            <hr>
            <h2>${titulo}</h2>
            <p class="price">${price}</p>
            <button onclick="agregarAlCarrito(event,${productId}, '${titulo}', ${price})">Add to Cart</button>
            
        </div>`
        });
        
        // Establece el contenido HTML una vez fuera del bucle
        document.getElementById("products-container").innerHTML = productosHTML;
    } catch (error) {
        mostrarErrorModal('Error al obtener productos: ' + error.message);
    }
}

function mostrarErrorModal(mensaje) {
    const errorModal = document.getElementById('error-modal');
    const errorModalMensaje = document.getElementById('error-modal-mensaje');

    errorModalMensaje.textContent = mensaje;
    errorModal.style.display = 'block';
}


mostrarErrorModal();
getProduct();

