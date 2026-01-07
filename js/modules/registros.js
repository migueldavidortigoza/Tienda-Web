// Guarda un item en una lista y persiste
export function guardarRegistro(clave, lista, item) {
    const nuevaLista = [...lista, item];
    localStorage.setItem(clave, JSON.stringify(nuevaLista));
    return nuevaLista;
}

// Carga registros desde localStorage
export function cargarRegistros(clave) {
    return JSON.parse(localStorage.getItem(clave)) || [];
}

// Limpia registros
export function limpiarRegistros(clave) {
    localStorage.removeItem(clave);
    return [];
}