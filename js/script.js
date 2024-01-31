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
                    <a href="#" class="w3-button w3-black w3-padding-large"  onclick="agregarAlCarrito(event,${productId}, '${titulo}', ${price})">AGREGAR AL CARRITO</a>
                </div>
            </div>`;
        });

        document.getElementById("products-container").innerHTML = productosHTML;

    } catch (error) {
        mostrarErrorModal('Error al obtener productos: ' + error.message);
    }
};

const getCategory = async () => {
    try {
        const response = await fetch('https://fakestoreapi.com/products/categories');
        const categories = await response.json();
        let categoriasHTML = '<ul>';

        categories.forEach(categoria => {
            categoriasHTML += `<li><a href="#" class="w3-bar-item w3-button">${categoria}</a></li>`;
        });

        categoriasHTML += '</ul>';
        document.getElementById("categories-list").innerHTML = categoriasHTML;
    } catch (error) {
        mostrarErrorModal('Error al obtener las categorias: ' + error.message);
    }
};

function agregarAlCarrito(event, id, title, price) {
    event.preventDefault();
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
    const totalSpan = document.getElementById('total');
    let carritoHTML = '';
    let total = 0;

    if (carrito.length > 0) {
        carrito.forEach(item => {
            const subtotal = item.price * item.cantidad;
            total += subtotal;

            carritoHTML += `
                <div>
                    <p class="red">${item.title} x ${item.cantidad} - $${subtotal.toFixed(2)} <i class="fa fa-times-circle-o eliminar-producto"  data-product-id="${item.id}" aria-hidden="true"></i></p>
                </div>`;
        });

        const contenidoSweetAlert = `${carritoHTML}<h3>Total: $${total.toFixed(2)}</h3>`;

        openModal.addEventListener('click', (e) => {
            Swal.fire({
                title: 'Carrito de Compras',
                html: contenidoSweetAlert,
                color: 'white',
                background: 'url(../img/modal_bg.jpg)',
                confirmButtonText: `Pagar`,
                cancelButtonText: `Cerrar`,
                showCancelButton: true,
                didOpen: () => {
                    document.querySelectorAll('.eliminar-producto').forEach(btn => {
                        btn.addEventListener('click', function () {
                            const productId = parseInt(this.dataset.productId, 10);
                            eliminarProducto(productId);
                            Swal.close();
                        });
                    });
                },
            }).then((result) => {
                if (result.isConfirmed) {
                    pagar();
                }
            });
        });
    } else {
        openModal.addEventListener('click', (e) => {
            Swal.fire({
                title: 'Carrito de Compras',
                html: '<p>El carrito está vacío.</p>',
                color: 'white',
                background: 'url(../img/modal_bg.jpg)',
                confirmButtonText: `Cerrar`,
            });
        });
    }

    totalSpan.textContent = total.toFixed(2);
}

function pagar() {
    Swal.fire({
        title: 'Gracias por tu compra!',
        html: '¡Gracias por tu compra!.<br> Apreciamos tu preferencia. Si tienes alguna pregunta o necesitas asistencia, no dudes en contactarnos.<br> ¡Esperamos que disfrutes tu producto!',
        icon: 'success',
        confirmButtonText: 'Cerrar',
        color: 'white',
        background: 'url(../img/modal_bg.jpg)'
    });

    vaciarCarrito();
}

const pay = document.getElementById("buy");
pay.addEventListener('click', function (event) {
    event.preventDefault();
    pagar();
});

function guardarCarritoEnLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

const openModal = document.getElementById("modalcarrito");
const closeModal = document.getElementById("close");
const modal = document.querySelector('.w3-modal');

closeModal.addEventListener("click", (e) => {
    e.preventDefault();
    modal.style.display = "none";
});

function vaciarCarrito() {
    carrito.length = 0;
    mostrarCarrito();
    guardarCarritoEnLocalStorage();
}

function eliminarProducto(id) {
    const index = carrito.findIndex(item => item.id === id);

    if (index !== -1) {
        if (carrito[index].cantidad > 1) {
            carrito[index].cantidad--;
        } else {
            carrito.splice(index, 1);
        }

        mostrarCarrito();
        guardarCarritoEnLocalStorage();
    }
}

document.getElementById("products-container").addEventListener('click', function (event) {
    const target = event.target;

    if (target.classList.contains('eliminar-producto')) {
        const productId = parseInt(target.dataset.productId, 10);
        eliminarProducto(productId);
    }
});

getProduct();
getCategory();
