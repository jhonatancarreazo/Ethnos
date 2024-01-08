const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
const getProduct = async () => {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        const products = await response.json();

        let productosHTML = '';

        products.forEach(producto => {
            let titulo = producto.title;
            let image = producto.image;
            let price = producto.price;
            let productId = producto.id;

            productosHTML += `<div class="card" id="product-${productId}">
                <h3 class="card__title">${titulo}</h3>
                <div class="card__body"><img src="${image}" alt="${titulo}"></div>
                <div class="card__footer">
                    <p>${price}</p>
                    <a href="" class="w3-button w3-black w3-padding-large" onclick="agregarAlCarrito(event,${productId}, '${titulo}', ${price})">AGREGAR AL CARRITO</a>
                </div>
            </div>`;
        });

        // Establece el contenido HTML una vez fuera del bucle
        document.getElementById("products-container").innerHTML = productosHTML;
    } catch (error) {
        console.error('Error al obtener productos:', error);
    }
}

const getCategory = async () => {
    try {
        const response = await fetch('https://fakestoreapi.com/products/categories');
        const categories = await response.json();
        let categoriasHTML = '';

        categories.forEach(categoria => {
            categoriasHTML += `<li><a href="#" class="w3-bar-item w3-button">${categoria}</a></li>`;
        });

        // Establece el contenido HTML una vez fuera del bucle
        document.getElementById("categories-list").innerHTML = categoriasHTML;
    } catch (error) {
        console.error('Error al obtener las categorías:', error);
    }
}



function agregarAlCarrito(event,id, title, price) {
    event.preventDefault(); // Evita la recarga de la página
    const productoEnCarrito = carrito.find(item => item.id === id);

    if (productoEnCarrito) {
      productoEnCarrito.cantidad++;
    } else {
      carrito.push({ id, title, price, cantidad: 1 });
    }

    mostrarCarrito();
    guardarCarritoEnLocalStorage();
}

function mostrarCarrito() {
    const listaCarrito = document.getElementById('lista-carrito');
    const totalSpan = document.getElementById('total');
    listaCarrito.innerHTML = '';
    
    let total = 0;

    carrito.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.title} x${item.cantidad} - $${item.price * item.cantidad}`;
      listaCarrito.appendChild(li);

      total += item.price * item.cantidad;
    });

    totalSpan.textContent = total.toFixed(2);
}



function guardarCarritoEnLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

const openModal = document.getElementById("modalcarrito");
const closeModal = document.getElementById("close");
const modal = document.querySelector('.w3-modal');

openModal.addEventListener('click', (e) => {
    e.preventDefault();
    modal.style.display = "block";
});

closeModal.addEventListener("click", (e) => {
    e.preventDefault();
    modal.style.display = "none";
});

getProduct();
getCategory();
mostrarCarrito();
