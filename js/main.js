import { productos } from "./data/productos.js";
import { 
    guardarRegistro,
    cargarRegistros,
    limpiarRegistros
} from "./modules/registros.js";

const contenedorProductos = document.getElementById("productos");
const contenedorCarrito = document.getElementById("carrito");
const totalSpan = document.getElementById("total");

let carrito = cargarRegistros("carrito");

// Render productos
function renderProductos() {
    productos.forEach(prod => {
        const div = document.createElement("div");
        div.innerHTML = `
          <p>${prod.nombre} - $${prod.precio}</p>
          <button>Agregar</button>
        `;
        div.querySelector("button")
          .addEventListener("click", () => agregarAlCarrito(prod));
        contenedorProductos.appendChild(div);
    });
}

function agregarAlCarrito(productos) {
    carrito = guardarRegistro("carrito", carrito, producto);
    renderCarrito();
}

function renderCarrito() {
    contenedorCarrito.innerHTML = "";

    carrito.forEach((prod, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
          ${prod.nombre} - $${prod.precio}
          <button data-index="${index}">❌</button>
        `;
        
        li.querySelector("button")
          .addEventListener("click", () => eliminarDelCarrito(index));

        contenedorCarrito.appendChild(li);
    });

    const total = carrito.reduce((acc, p) => acc + p.precio, 0);
    totalSpan.textContent = total;
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderCarrito();
}