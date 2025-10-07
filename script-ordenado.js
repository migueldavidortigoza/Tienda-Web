//========================1. CONFIGURACION DE TEMA OSCURO=====================
// Maneja el boton 🌙/☀️ y guarda la preferenciaen en localStorage 

const btnTema = document.getElementById("toggle-tema");

if (localStorage.getItem("tema") === "oscuro") {
    document.body.classList.add("oscuro");
    btnTema.textContent = "☀️ Claro";
}

btnTema.addEventListener("click", () => {
    document.body.classList.toggle("oscuro");

    if (document.body.classList.contains("oscuro")) {
        btnTema.textContent = "☀️ Claro";
        localStorage.setItem("tema", "oscuro");
    } else {
        btnTema.textContent = "🌙 Oscuro";
        localStorage.setItem("tema", "claro");
    }
});

//====================2. LISTA DE PRODUCTOS====================
// array de productos con { id, titulo, precio, img, categoria }

const productos = [
    { id: 1, titulo: "Auriculares", precio: 20, img: "img/auriculares.jpg", categoria: "Gamer" },
    { id: 2, titulo: "Mouse Gamer", precio: 15, img: "img/mouse.jpeg", categoria: "Gamer" },
    { id: 3, titulo: "Teclado Mecanico", precio: 30, img: "img/teclado.jpeg", categoria: "Gamer" },
    { id: 4, titulo: "Camiseta Deportiva", precio: 25, img: "img/camiseta.jpg", categoria: "Moda" },
    { id: 5, titulo: "Smartphone", precio: 300, img: "img/phone.jpg", categoria: "Telefonia" },
];

//==========================3. VARIABLES GLOBALES==========================
//carrito (se recupera de localStorage si existe o arranca vacio)

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

//referencias al DOM (contenedor, listaCarrito, Contador, Modal, etc.)

const contenedor = document.getElementById("productos");
const listaCarrito = document.getElementById("items");
const textTotal = document.getElementById("total");
const contador = document.getElementById("contador");
const modal = document.getElementById("modalCarrito");

//=========================4. FUNCIONES PRINCIPALES DEL CARRITO=====================
// Muestra los Productos los cuales pueden ser filtrados por categoria

function mostrarProductos(categoria) {
    contenedor.innerHTML = ""; // limpio los productos antes de mostrar
    
    // filtro si es "Todos" muestro todo, sino filtro por categoria
    let filtrados = categoria === "Todos"
        ? productos
        : productos.filter(p => p.categoria === categoria);

    filtrados.forEach(p => {
        const card = document.createElement("div");
        card.classList.add("producto");

        card.innerHTML = `
            <img src="${p.img}" alt="${p.titulo}" class="img-producto">
            <h3>${p.titulo}</h3>
            <p>$${p.precio}</p>
            <button onclick="agregarAlCarrito(${p.id})">Agregar</button>
        `;

        contenedor.appendChild(card);
    });
}

// agrega un producto al carrito (si ya esxiste, suma cantidad)

function agregarAlCarrito(idProducto) {
    const producto = productos.find(p => p.id === idProducto);
    const productoEnCarrito = carrito.find(p => p.id === idProducto);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    guardarCarrito();
    actualizarCarrito();

    // animacion contador y toast
    contador.classList.add("animar");
    setTimeout(() => contador.classList.remove("animar"), 400);
    mostrarToast("Producto agregado", "ok");
}

// elimina un producto del carrito segun indice 

function eliminarDelCarrito(indice) {
    carrito.splice(indice, 1);
    guardarCarrito();
    actualizarCarrito();
    mostrarToast("Producto eliminado", "error");
}

// Vacia todo el Carrito

function vaciarCarrito() {
    carrito = [];
    localStorage.removeItem("carrito");
    actualizarCarrito();
    mostrarToast("Carrito vacío", "error");
}

// Guardar el Carrito en localStorage

function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
} 

// Actualiza lista de Carrtio y total en pantalla

function actualizarCarrito() {
    contador.textContent = carrito.reduce((acc, p) => acc + p.cantidad, 0)
    listaCarrito.innerHTML = "";

    if (carrito.length === 0) {
        listaCarrito.innerHTML = "<li>🛒 Tu carrito esta vacio</li>";
        textTotal.textContent = "Total: $0";
        return;
    }

    let total = 0;
    carrito.forEach((p, index) => {
        const subtotal = p.precio * p.cantidad;
        const li = document.createElement("li");
        li.classList.add("item-carrito");

        li.innerHTML = `
             <span>${p.titulo}</span>
             <span>$${p.precio}</span>
             <div class="cantidad">
                 <button onclick="cambiarCantidad(${index}, -1)">➖</button>
                 <span>${p.cantidad}</span>
                 <button onclick="cambiarCantidad(${index}, 1)">➕</button>
             </div>
             <span>= $${subtotal}</span>
             <button class="btn-eliminar" onclick="eliminarDelCarrito(${index})">❌</button>
        `;

        listaCarrito.appendChild(li);
        total += subtotal;
    });

    textTotal.textContent = `Total: $${total}`;
}

// disminuye o aumenta la cantidad de los producto selecctionado

function cambiarCantidad(indice, cambio) {
    carrito[indice].cantidad += cambio;
    if (carrito[indice].cantidad <= 0) {
        carrito.splice(indice, 1); //elimina si queda en 0
    }

    guardarCarrito();
    actualizarCarrito();
}

//=============================5. MODAL DEL CARRITO==========================
// Abre y cierra Modal

function abrirModal() { modal.style.display = "flex"; }
function cerrarModal() { modal.style.display = "none"; }

// cierra modal si se clikea fuera del Modal

window.onclick = function(e) {
    if (e.target === modal) { cerrarModal(); }
}

//===========================6. MENU HAMBURGUESA (mobile)============================
// abrir/cerrar menu mobile

actualizarCarrito();
// ===== menu hamburguesa (mobile)
const menuToggle = document.getElementById('menu-toggle');
const acciones = document.getElementById('acciones');

if (menuToggle && acciones) { // alternar apertura
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation(); //evita que el click se propague al document
        const abierto = acciones.classList.toggle('abierto');
        menuToggle.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    });
    // cerrar al clickear fuera
    document.addEventListener('click', (e) => {
        const clickDentroHeader = e.target.closest('header');
        if (!clickDentroHeader && acciones.classList.contains('abierto')) {
            acciones.classList.remove('abierto');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
    // cerrar si abris el modal del carrito (opcional pero util)
    const _abrirModalOriginal = abrirModal;
    window.abrirModal = function() {
        acciones.classList.remove('abierto');
        menuToggle.setAttribute('aria-expanded', 'false');
        _abrirModalOriginal();
    };
}

//=========================7. FILTROS Y FONDOS=========================
// Cambia Fondo de la pagina segun categoria

function cambiarFondo(nicho) {
    document.body.classList.remove("nicho-Gamer", "nicho-Moda", "nicho-Hogar", "nicho-Telefonia"); //borra anteriores
    document.body.classList.add(`nicho-${nicho}`); //agregan la nueva 
}

// logica de los botones de filtro (activo, mostrar y cambiar fondo)
   // === marca boton activo automaticamente ===

const botonesFiltro = document.querySelectorAll("#filtros button");
// recorro cada boton y le pongo un click
botonesFiltro.forEach(boton => {
    boton.addEventListener("click", () => {
        botonesFiltro.forEach(b => b.classList.remove("activo"));  // quitar "activo" de todos
        boton.classList.add("activo");  // le pone activo solo a el boton clickeado
        // muestra productos de esa categoria
        const categoria = boton.dataset.cat; // usamos data-cat
        mostrarProductos(categoria);
        cambiarFondo(categoria);//cambia el fonde segun categoria
        localStorage.setItem("filtroActivo", categoria);

    }); 
});

//=========================8. toast (notificaciones)=========================

function mostrarToast(mensaje, tipo = "info") {
    const toast = document.createElement("div");
    toast.className = `toast ${tipo}`; // arranca visible
    toast.innerHTML = tipo === "ok"
        ? `✅ ${mensaje}`
        : tipo === "error"
        ? `❌ ${mensaje}`
        : `ℹ️ ${mensaje}`;

    document.body.appendChild(toast);
    

    setTimeout(() => toast.classList.add("desaparecer"), 2000);
    setTimeout(() => toast.remove(), 3000); 
}


//==============================9. INICIO AUTOMATICO==============================
//apenas carga la pagina, aplica el filtro guardado o "Todos"
document.addEventListener("DOMContentLoaded", () => {
    let filtroGuardado = localStorage.getItem("filtroActivo") || "Todos";
    const botonGuardado = [...botonesFiltro].find(b => b.dataset.cat === filtroGuardado);

    if (botonGuardado) {
        botonGuardado.classList.add("activo");
    }

    mostrarProductos(filtroGuardado);
    cambiarFondo(filtroGuardado);
});